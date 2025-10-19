-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 19, 2025 at 12:45 PM
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
(1, 1, 'LOGIN', 'NEW LOGIN for chief', '2025-10-19 10:29:31'),
(2, 1, 'ADD', 'Added MDRRMO to Emergency Contacts by chief', '2025-10-19 10:33:26'),
(3, 1, 'ADD', 'Added BFP to Emergency Contacts by chief', '2025-10-19 10:34:21'),
(4, 1, 'ADD', 'Added PNP to Emergency Contacts by chief', '2025-10-19 10:34:38'),
(5, 1, 'ADD', 'Added RHU to Emergency Contacts by chief', '2025-10-19 10:34:54'),
(6, 1, 'ADD', 'Added UCDH to Emergency Contacts by chief', '2025-10-19 10:35:21'),
(7, 1, 'ADD', 'Added PPMCII to Emergency Contacts by chief', '2025-10-19 10:35:39'),
(8, 1, 'ADD', 'Added CMH (Nursery) to Emergency Contacts by chief', '2025-10-19 10:35:54'),
(9, 1, 'UPDATE', 'Updated CMH(Nursery) to Emergency Contacts by chief', '2025-10-19 10:36:25'),
(10, 1, 'ADD', 'Added new inventory item \"First Aid Kit\" (Quantity: 20) by chief', '2025-10-19 10:38:06'),
(11, 1, 'ADD', 'Added new inventory item \"Water\" (Quantity: 50) by chief', '2025-10-19 10:38:21'),
(12, 1, 'UPDATE', 'Updated Water quantity to 100 by chief', '2025-10-19 10:38:43'),
(13, 1, 'ADD', 'Added new inventory item \"Band Aid\" (Quantity: 1252) by chief', '2025-10-19 10:39:12'),
(14, 1, 'DELETE', 'Deleted Band Aid with quantity of 1252 by chief', '2025-10-19 10:39:15');

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
(2, 'John', 'Doe', 'john@mdrrmo.com', '$2b$10$BbkCx/zmOy59vy.zF/oi2O22/zgA3Win6GvPbhIWvSAcH.k3AiMIS', '2025-10-13 07:38:54', 'Sitio Showlook', '099090909090');

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
(1, 'MDRRMO', '116', '(042)-586-1116', '0920-209-7070', '2025-10-19 10:33:26'),
(3, 'BFP', '117', '(042) 585-4472', '0950-055-1171', '2025-10-19 10:34:21'),
(4, 'PNP', '166', NULL, '0947-347-8094', '2025-10-19 10:34:38'),
(5, 'RHU', NULL, '(042)585-4205', NULL, '2025-10-19 10:34:54'),
(6, 'UCDH', NULL, '(042)585-2114', NULL, '2025-10-19 10:35:21'),
(7, 'PPMCII', NULL, '(042)585-4531', NULL, '2025-10-19 10:35:39'),
(8, 'CMH(Nursery)', NULL, '(042)585-4281', NULL, '2025-10-19 10:35:54');

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
  `street` varchar(100) DEFAULT NULL,
  `type_of_accident` enum('Fire','Flood','Earthquake','Motorcycle Accident','Pedestrian Accident','Four Wheels Accident') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('pending','accepted','resolved','denied') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `incident_reports`
--

INSERT INTO `incident_reports` (`id`, `user_id`, `photo_url`, `region`, `city`, `district`, `street`, `type_of_accident`, `created_at`, `status`) VALUES
(1, 2, '/uploads/1760344857512--68f30904-add5-4517-9df7-cf5b313c2bda2387868088615419712.jpg', 'Quezon', 'Candelaria', 'Kinatihan II', 'sitio', 'Motorcycle Accident', '2025-10-13 08:40:57', 'denied'),
(2, 2, '/uploads/1760345067954--68f30904-add5-4517-9df7-cf5b313c2bda2387868088615419712.jpg', 'Quezon', 'Candelaria', 'Kinatihan II', 'sitio', 'Motorcycle Accident', '2025-10-13 08:44:28', 'accepted'),
(3, 2, '/uploads/1760345681821--8341bcd1-70c2-4756-a0ff-eaa513cc22473354393655268354748.jpg', 'Quezon', 'Candelaria', 'Pahinga Sur', 'sitio silangan', 'Four Wheels Accident', '2025-10-13 08:54:42', 'accepted'),
(4, 2, '/uploads/1760350794163--17339e35-e04d-49d0-a85e-402475a2d7963819194010433811875.jpg', 'Quezon', 'Candelaria', 'Pahinga Sur', 'cc', 'Pedestrian Accident', '2025-10-13 10:19:54', 'accepted');

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
(1, 'First Aid Kit', 20, 'chief', '2025-10-19 10:38:06', '2025-10-19 10:38:06'),
(2, 'Water', 100, 'chief', '2025-10-19 10:38:21', '2025-10-19 10:38:43');

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
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `client_credentials`
--
ALTER TABLE `client_credentials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `emergency_contacts`
--
ALTER TABLE `emergency_contacts`
  MODIFY `contact_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `incident_reports`
--
ALTER TABLE `incident_reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `inventories`
--
ALTER TABLE `inventories`
  MODIFY `inventory_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
