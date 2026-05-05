package com.sofen.backend.features.booking.service.impl;

import com.sofen.backend.common.exception.ResourceNotFoundException;
import com.sofen.backend.domain.entity.Booking;
import com.sofen.backend.domain.entity.Schedule;
import com.sofen.backend.domain.entity.Trainer;
import com.sofen.backend.domain.entity.User;
import com.sofen.backend.domain.enums.BookingStatus;
import com.sofen.backend.features.booking.dto.request.CreateBookingRequest;
import com.sofen.backend.features.booking.dto.response.BookingResponse;
import com.sofen.backend.features.booking.service.BookingService;
import com.sofen.backend.features.bookinghistory.service.BookingHistoryService;
import com.sofen.backend.repository.BookingRepository;
import com.sofen.backend.repository.ScheduleRepository;
import com.sofen.backend.repository.TrainerRepository;
import com.sofen.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final ScheduleRepository scheduleRepository;
    private final UserRepository userRepository;
    private final TrainerRepository trainerRepository;
    private final BookingHistoryService bookingHistoryService;

    @Override
    @Transactional
    public BookingResponse createBooking(Long userId, CreateBookingRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User tidak ditemukan"));

        Trainer trainer = trainerRepository.findById(request.getTrainerId())
                .orElseThrow(() -> new ResourceNotFoundException("Trainer tidak ditemukan"));

        Schedule schedule = scheduleRepository.findById(request.getScheduleId())
                .orElseThrow(() -> new ResourceNotFoundException("Jadwal tidak ditemukan"));

        if (!schedule.getTrainer().getId().equals(trainer.getId())) {
            throw new IllegalArgumentException("Jadwal ini bukan milik trainer yang dipilih");
        }

        boolean isAlreadyBooked = bookingRepository.existsByScheduleIdAndStatusIn(
                schedule.getId(),
                List.of(BookingStatus.PENDING, BookingStatus.CONFIRMED)
        );

        if (isAlreadyBooked) {
            throw new IllegalArgumentException("Maaf, jadwal ini sudah dipesan oleh orang lain.");
        }

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setTrainer(trainer);
        booking.setSchedule(schedule);
        booking.setBookedAt(LocalDateTime.now());
        booking.setDurationMinutes(60);
        booking.setNotes(request.getNotes());
        booking.setStatus(BookingStatus.PENDING);

        Booking savedBooking = bookingRepository.save(booking);
        return toResponse(savedBooking);
    }

    @Override
    @Transactional
    public BookingResponse updateBookingStatus(Long bookingId, BookingStatus newStatus) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking tidak ditemukan"));

        booking.setStatus(newStatus);
        Booking updatedBooking = bookingRepository.save(booking);

        if (newStatus == BookingStatus.DONE) {
            bookingHistoryService.createFromBooking(updatedBooking);
        }

        return toResponse(updatedBooking);
    }

    @Override
    public List<BookingResponse> getBookingsByUserId(Long userId) {
        return bookingRepository.findByUserIdAndStatusInOrderByBookedAtAsc(
                userId,
                List.of(BookingStatus.PENDING, BookingStatus.CONFIRMED)
        ).stream().map(this::toResponse).toList();
    }

    @Override
    public BookingResponse getBookingById(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking tidak ditemukan dengan ID: " + bookingId));
        return toResponse(booking);
    }

    @Override
    @Transactional
    public BookingResponse cancelBooking(Long bookingId) {
        return updateBookingStatus(bookingId, BookingStatus.CANCELLED);
    }

    @Override
    @Transactional
    public BookingResponse markBookingDone(Long bookingId) {
        return updateBookingStatus(bookingId, BookingStatus.DONE);
    }

    private BookingResponse toResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .userId(booking.getUser().getId())
                .trainerId(booking.getTrainer().getId())
                .scheduleId(booking.getSchedule().getId())
                .notes(booking.getNotes())
                .durationMinutes(booking.getDurationMinutes())
                .status(booking.getStatus())
                .bookedAt(booking.getBookedAt())
                .createdAt(booking.getCreatedAt())
                .build();
    }
}
