package com.sofen.backend.features.booking.service.impl;

import com.sofen.backend.domain.entity.Booking;
import com.sofen.backend.domain.entity.Schedule;
import com.sofen.backend.domain.entity.Trainer;
import com.sofen.backend.domain.entity.User;
import com.sofen.backend.domain.enums.BookingStatus;
import com.sofen.backend.features.booking.dto.request.CreateBookingRequest;
import com.sofen.backend.features.booking.dto.response.BookingResponse;
import com.sofen.backend.features.booking.service.BookingService;
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

    @Override
    @Transactional
    public BookingResponse createBooking(Long userId, CreateBookingRequest request) {
        // 1. Cari User (Orang yang mau booking)
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User tidak ditemukan"));

        // 2. Cari Trainer
        Trainer trainer = trainerRepository.findById(request.getTrainerId())
                .orElseThrow(() -> new RuntimeException("Trainer tidak ditemukan"));

        // 3. Cari Jadwal (Schedule)
        Schedule schedule = scheduleRepository.findById(request.getScheduleId())
                .orElseThrow(() -> new RuntimeException("Jadwal tidak ditemukan"));

        // 4. VALIDASI: Pastikan jadwal yang dipilih itu milik Trainer yang benar
        if (!schedule.getTrainer().getId().equals(trainer.getId())) {
            throw new RuntimeException("Jadwal ini bukan milik trainer yang dipilih");
        }

        // 5. VALIDASI UTAMA: Pastikan jadwal belum di-booking orang lain (status PENDING/CONFIRMED)
        // Kita menggunakan query canggih yang sudah ada di BookingRepository kamu!
        boolean isAlreadyBooked = bookingRepository.existsByScheduleIdAndStatusIn(
                schedule.getId(),
                List.of(BookingStatus.PENDING, BookingStatus.CONFIRMED)
        );

        if (isAlreadyBooked) {
            throw new RuntimeException("Maaf, jadwal ini sudah dipesan oleh orang lain.");
        }

        // 6. Buat Entitas Booking Baru
        Booking booking = new Booking();
        booking.setUser(user);
        booking.setTrainer(trainer);
        booking.setSchedule(schedule);
        // Anggap waktu booking adalah gabungan hari ini dan waktu mulai jadwal (bisa disesuaikan nanti)
        booking.setBookedAt(LocalDateTime.now()); 
        booking.setDurationMinutes(60);
        booking.setNotes(request.getNotes());
        booking.setStatus(BookingStatus.PENDING); // Status awal ketika baru di-klik adalah PENDING

        // 7. Simpan ke Database
        Booking savedBooking = bookingRepository.save(booking);

        // 8. Kembalikan Response ke Frontend
        return BookingResponse.builder()
                .id(savedBooking.getId())
                .userId(savedBooking.getUser().getId())
                .trainerId(savedBooking.getTrainer().getId())
                .scheduleId(savedBooking.getSchedule().getId())
                .notes(savedBooking.getNotes())
                .durationMinutes(savedBooking.getDurationMinutes())
                .status(savedBooking.getStatus())
                .bookedAt(savedBooking.getBookedAt())
                .createdAt(savedBooking.getCreatedAt())
                .build();
    }

    @Override
    @Transactional
    public BookingResponse updateBookingStatus(Long bookingId, BookingStatus newStatus) {
        // 1. Cari Booking berdasarkan ID
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking tidak ditemukan"));

        // 2. Ubah statusnya (Misal dari PENDING jadi CONFIRMED atau CANCELED)
        booking.setStatus(newStatus);

        // 3. Simpan perubahan ke Database
        Booking updatedBooking = bookingRepository.save(booking);

        // 4. Kembalikan Response ke Frontend
        return BookingResponse.builder()
                .id(updatedBooking.getId())
                .userId(updatedBooking.getUser().getId())
                .trainerId(updatedBooking.getTrainer().getId())
                .scheduleId(updatedBooking.getSchedule().getId())
                .notes(updatedBooking.getNotes())
                .durationMinutes(updatedBooking.getDurationMinutes())
                .status(updatedBooking.getStatus())
                .bookedAt(updatedBooking.getBookedAt())
                .createdAt(updatedBooking.getCreatedAt())
                .build();
    }
}
