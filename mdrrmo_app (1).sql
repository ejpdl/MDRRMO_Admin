-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 13, 2025 at 09:32 AM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mdrrmo_app`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_credentials`
--

CREATE TABLE `admin_credentials` (
  `admin_id` int(11) NOT NULL,
  `fullname` varchar(255) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `admin_password` varchar(255) NOT NULL,
  `role` enum('chief','inspector','staff') DEFAULT 'staff',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `admin_address` varchar(255) NOT NULL,
  `admin_contact` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_credentials`
--

INSERT INTO `admin_credentials` (`admin_id`, `fullname`, `email`, `admin_password`, `role`, `created_at`, `admin_address`, `admin_contact`) VALUES
(1, 'Ephraim De Lara', 'ephraim@mdrrmo.com', '$2b$10$DXSkVrCQ2QnruSzxlhSqtOVfLR7zHldbrkY2cq5a6a8nya5/2FTVO', 'chief', '2025-10-01 06:30:46', '#35 Sitio Silangan', '09381689796'),
(2, 'Katricia Pida', 'kat@mdrrmo.com', '$2b$10$6POI6nA1QoOh6CORmRMX5OfGjZW4XoxCxi1Oxv1GNixciMBMXzLb2', 'staff', '2025-10-01 07:05:55', '#34 Malabanban Norte', '09092999221');

-- --------------------------------------------------------

--
-- Table structure for table `admin_logs`
--

CREATE TABLE `admin_logs` (
  `log_id` int(11) NOT NULL,
  `admin_id` int(11) NOT NULL,
  `action` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_logs`
--

INSERT INTO `admin_logs` (`log_id`, `admin_id`, `action`, `description`, `created_at`) VALUES
(1, 1, 'UPDATE', 'Updated First Aid Kit quantity to 50 by chief', '2025-10-13 03:16:36'),
(2, 1, 'UPDATE', 'Updated First Aid Kit quantity to 501 by chief', '2025-10-13 03:34:57'),
(3, 1, 'UPDATE', 'Updated First Aid Kitqw quantity to 501 by chief', '2025-10-13 03:35:25'),
(4, 1, 'UPDATE', 'Updated Water quantity to 12 by chief', '2025-10-13 03:44:46'),
(5, 1, 'DELETE', 'Deleted qwqw with quantity of 12 by chief', '2025-10-13 03:45:01'),
(6, 1, 'ADD', 'Added new inventory item \"212\" (Quantity: 12) by chief', '2025-10-13 03:55:29'),
(7, 1, 'ADD', 'Added new inventory item \"weweewwe\" (Quantity: 23) by chief', '2025-10-13 04:11:22'),
(8, 2, 'UPDATE', 'Updated wew quantity to 2312 by staff', '2025-10-13 04:11:56'),
(9, 2, 'DELETE', 'Deleted wew with quantity of 2312 by staff', '2025-10-13 04:15:40'),
(10, 2, 'ADD', 'Added qw to Emergency Contacts by staff', '2025-10-13 04:24:24'),
(11, 2, 'UPDATE', 'Updated qwqwqw to Emergency Contacts by staff', '2025-10-13 04:25:42'),
(12, 2, 'DELETE', 'Deleted 12 to Emergency Contacts by staff', '2025-10-13 04:31:46'),
(13, 2, 'ADD', 'Added BFP to Emergency Contacts by staff', '2025-10-13 05:04:10'),
(14, 2, 'UPDATE', 'Updated BFP to Emergency Contacts by staff', '2025-10-13 05:04:42'),
(15, 2, 'DELETE', 'Deleted BFP to Emergency Contacts by staff', '2025-10-13 05:05:00'),
(16, 1, 'ADD', 'Added new inventory item \"wew\" (Quantity: 23) by chief', '2025-10-13 05:05:32'),
(17, 1, 'UPDATE', 'Updated wew12 quantity to 2 by chief', '2025-10-13 05:06:25'),
(18, 2, 'DELETE', 'Deleted wew12 with quantity of 2 by staff', '2025-10-13 05:06:44'),
(19, 1, 'LOGIN', 'NEW LOGIN for chief', '2025-10-13 06:37:30');

-- --------------------------------------------------------

--
-- Table structure for table `client_credentials`
--

CREATE TABLE `client_credentials` (
  `id` int(11) NOT NULL,
  `firstname` varchar(100) NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `address` varchar(255) DEFAULT NULL,
  `contact` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `client_credentials`
--

INSERT INTO `client_credentials` (`id`, `firstname`, `lastname`, `username`, `password`, `created_at`, `address`, `contact`) VALUES
(1, 'Ephraim Justine Paul', 'De Lara', 'EJ', 'EJ', '2025-09-26 09:30:15', 'Pahinga Sur', '09381689796');

-- --------------------------------------------------------

--
-- Table structure for table `emergency_contacts`
--

CREATE TABLE `emergency_contacts` (
  `contact_id` int(11) NOT NULL,
  `office_name` varchar(255) NOT NULL,
  `hotline` varchar(50) DEFAULT NULL,
  `landline` varchar(50) DEFAULT NULL,
  `phone_number` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `emergency_contacts`
--

INSERT INTO `emergency_contacts` (`contact_id`, `office_name`, `hotline`, `landline`, `phone_number`, `created_at`) VALUES
(4, 'RHU', NULL, '(042) 585-4205', NULL, '2025-10-01 10:05:04'),
(44, 'MDRRMO', '116', '(042)-586-116', '0920-209-7070', '2025-10-08 11:02:41');

-- --------------------------------------------------------

--
-- Table structure for table `incident_reports`
--

CREATE TABLE `incident_reports` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `region` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `district` varchar(100) DEFAULT NULL,
  `street` varchar(255) DEFAULT NULL,
  `house_no` varchar(100) DEFAULT NULL,
  `incident_date` date DEFAULT NULL,
  `incident_time` time DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('Pending','Accepted','Denied') DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `inventories`
--

CREATE TABLE `inventories` (
  `inventory_id` int(11) NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 0,
  `person_in_charge` enum('chief','inspector','staff') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inventories`
--

INSERT INTO `inventories` (`inventory_id`, `item_name`, `quantity`, `person_in_charge`, `created_at`, `updated_at`) VALUES
(13, 'First Aid Kitqw', 501, 'chief', '2025-10-08 09:54:27', '2025-10-13 03:35:25'),
(23, 'Water', 12, 'chief', '2025-10-13 03:44:31', '2025-10-13 03:44:46'),
(25, '212', 12, 'chief', '2025-10-13 03:55:29', '2025-10-13 03:55:29');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_credentials`
--
ALTER TABLE `admin_credentials`
  ADD PRIMARY KEY (`admin_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `admin_logs`
--
ALTER TABLE `admin_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `admin_id` (`admin_id`);

--
-- Indexes for table `client_credentials`
--
ALTER TABLE `client_credentials`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `emergency_contacts`
--
ALTER TABLE `emergency_contacts`
  ADD PRIMARY KEY (`contact_id`),
  ADD UNIQUE KEY `unique_office_name` (`office_name`);

--
-- Indexes for table `incident_reports`
--
ALTER TABLE `incident_reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `inventories`
--
ALTER TABLE `inventories`
  ADD PRIMARY KEY (`inventory_id`),
  ADD UNIQUE KEY `unique_item_name` (`item_name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_credentials`
--
ALTER TABLE `admin_credentials`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `admin_logs`
--
ALTER TABLE `admin_logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `client_credentials`
--
ALTER TABLE `client_credentials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `emergency_contacts`
--
ALTER TABLE `emergency_contacts`
  MODIFY `contact_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `incident_reports`
--
ALTER TABLE `incident_reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inventories`
--
ALTER TABLE `inventories`
  MODIFY `inventory_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin_logs`
--
ALTER TABLE `admin_logs`
  ADD CONSTRAINT `admin_logs_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `admin_credentials` (`admin_id`);

--
-- Constraints for table `incident_reports`
--
ALTER TABLE `incident_reports`
  ADD CONSTRAINT `incident_reports_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `client_credentials` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
