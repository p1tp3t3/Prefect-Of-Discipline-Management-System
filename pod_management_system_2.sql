-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 04, 2026 at 09:17 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pod_management_system_2`
--

-- --------------------------------------------------------

--
-- Table structure for table `absent_form`
--

CREATE TABLE `absent_form` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `form_number` varchar(255) NOT NULL,
  `student_id` bigint(20) UNSIGNED NOT NULL,
  `reason` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`reason`)),
  `evidences` longtext DEFAULT NULL,
  `note` text DEFAULT NULL,
  `rejected_reason` longtext DEFAULT NULL,
  `rejected_at` datetime DEFAULT NULL,
  `confirmed_at` datetime DEFAULT NULL,
  `date_from` date DEFAULT NULL,
  `date_to` date DEFAULT NULL,
  `archived_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `absent_form`
--

INSERT INTO `absent_form` (`id`, `form_number`, `student_id`, `reason`, `evidences`, `note`, `rejected_reason`, `rejected_at`, `confirmed_at`, `date_from`, `date_to`, `archived_at`, `created_at`) VALUES
(1, '12132501', 13, '[\"Excused Absence\"]', '[{\"file\":\"1-12132501.jpg\"}]', 'Rerum et autem culpa quo.', NULL, NULL, '2025-12-16 20:22:55', '2025-12-14', '2025-12-16', '2030-12-16 20:22:55', '2025-12-13 12:22:55'),
(2, '07252601', 8, '[\"Excused Absence\"]', '[{\"file\":\"1-07252601.jpg\"},{\"file\":\"2-07252601.jpg\"},{\"file\":\"3-07252601.jpg\"}]', 'Sint et est deleniti consequuntur aut rerum quia.', NULL, NULL, '2026-07-27 08:55:02', '2026-07-26', '2026-07-26', '2031-07-27 08:55:02', '2026-07-25 00:55:02'),
(3, '12272501', 25, '[\"Excused Absence\"]', '[{\"file\":\"1-12272501.jpg\"},{\"file\":\"2-12272501.jpg\"},{\"file\":\"3-12272501.jpg\"}]', 'Repellendus et quam consectetur autem illo ex.', NULL, NULL, '2025-12-29 09:24:49', '2025-12-28', '2025-12-29', '2030-12-29 09:24:49', '2025-12-27 01:24:49'),
(4, '02182601', 30, '[\"Excused Absence\"]', '[{\"file\":\"1-02182601.jpg\"},{\"file\":\"2-02182601.jpg\"}]', 'Non vel eligendi ut magnam et ad saepe.', 'Maiores eos modi maxime provident reprehenderit.', '2026-02-20 15:41:25', NULL, '2026-02-19', '2026-02-21', '2031-02-20 15:41:25', '2026-02-18 07:41:25'),
(5, '01182601', 18, '[\"Excused Absence\"]', '[{\"file\":\"1-01182601.jpg\"},{\"file\":\"2-01182601.jpg\"},{\"file\":\"3-01182601.jpg\"}]', 'Consectetur minus adipisci non est sequi accusantium.', 'Quaerat consequuntur autem fuga recusandae voluptates quia nostrum cumque vero.', '2026-01-21 01:15:25', NULL, '2026-01-19', '2026-01-21', '2031-01-21 01:15:25', '2026-01-17 17:15:25'),
(6, '02032601', 27, '[\"Excused Tardiness\"]', '[{\"file\":\"1-02032601.jpg\"}]', 'Inventore dolores ut quis eaque sunt veniam ut cum.', NULL, NULL, '2026-02-04 22:45:46', '2026-02-04', '2026-02-05', '2031-02-04 22:45:46', '2026-02-03 14:45:46'),
(7, '12192501', 16, '[\"Excused Absence\"]', '[{\"file\":\"1-12192501.jpg\"}]', NULL, NULL, NULL, NULL, '2025-12-20', '2025-12-20', NULL, '2025-12-18 22:57:47'),
(8, '08112601', 7, '[\"Excused Tardiness\"]', '[{\"file\":\"1-08112601.jpg\"},{\"file\":\"2-08112601.jpg\"},{\"file\":\"3-08112601.jpg\"}]', 'Natus perspiciatis voluptatem ullam omnis molestiae quia ullam.', NULL, NULL, '2026-08-14 07:16:57', '2026-08-12', '2026-08-14', '2031-08-14 07:16:57', '2026-08-10 23:16:57'),
(9, '02152601', 3, '[\"Excused Absence\"]', '[{\"file\":\"1-02152601.jpg\"}]', 'Odio consequuntur eos velit vel ex.', NULL, NULL, '2026-02-16 06:49:18', '2026-02-16', '2026-02-16', '2031-02-16 06:49:18', '2026-02-14 22:49:18'),
(10, '07032601', 15, '[\"Excused Tardiness\"]', '[{\"file\":\"1-07032601.jpg\"}]', 'Soluta fugiat nemo omnis quidem accusantium rem autem aspernatur.', NULL, NULL, '2026-07-05 13:00:27', '2026-07-04', '2026-07-05', '2031-07-05 13:00:27', '2026-07-03 05:00:27'),
(11, '09172501', 9, '[\"Excused Tardiness\"]', '[{\"file\":\"1-09172501.jpg\"}]', 'Consequatur assumenda sint ullam architecto sint non.', NULL, NULL, '2025-09-18 14:40:32', '2025-09-18', '2025-09-20', '2030-09-18 14:40:32', '2025-09-17 06:40:32'),
(12, '05042601', 9, '[\"Excused Tardiness\"]', '[{\"file\":\"1-05042601.jpg\"},{\"file\":\"2-05042601.jpg\"}]', NULL, NULL, NULL, NULL, '2026-05-05', '2026-05-07', NULL, '2026-05-04 00:36:15'),
(13, '06222601', 29, '[\"Excused Absence\"]', '[{\"file\":\"1-06222601.jpg\"},{\"file\":\"2-06222601.jpg\"},{\"file\":\"3-06222601.jpg\"}]', 'Illo provident iure dicta debitis.', 'Quasi laudantium eaque ullam doloremque dolores dolorum est.', '2026-06-25 18:02:33', NULL, '2026-06-23', '2026-06-24', '2031-06-25 18:02:33', '2026-06-22 10:02:33'),
(14, '06292601', 5, '[\"Excused Tardiness\"]', '[{\"file\":\"1-06292601.jpg\"}]', 'Voluptates labore facilis iste non.', NULL, NULL, '2026-07-02 22:30:14', '2026-06-30', '2026-06-30', '2031-07-02 22:30:14', '2026-06-29 14:30:14'),
(15, '03102601', 22, '[\"Excused Absence\"]', '[{\"file\":\"1-03102601.jpg\"},{\"file\":\"2-03102601.jpg\"},{\"file\":\"3-03102601.jpg\"}]', 'Dolor non dolore expedita officiis in quod dolore.', NULL, NULL, '2026-03-12 09:36:56', '2026-03-11', '2026-03-11', '2031-03-12 09:36:56', '2026-03-10 01:36:56'),
(16, '05152601', 3, '[\"Excused Tardiness\"]', '[{\"file\":\"1-05152601.jpg\"},{\"file\":\"2-05152601.jpg\"}]', 'Earum corrupti ea dignissimos dolorem corporis.', NULL, NULL, '2026-05-16 12:17:29', '2026-05-16', '2026-05-17', '2031-05-16 12:17:29', '2026-05-15 04:17:29'),
(17, '12022501', 9, '[\"Excused Tardiness\"]', '[{\"file\":\"1-12022501.jpg\"}]', 'Excepturi provident et suscipit voluptatem sit dolorem fugit.', NULL, NULL, '2025-12-04 07:02:37', '2025-12-03', '2025-12-03', '2030-12-04 07:02:37', '2025-12-01 23:02:37'),
(18, '06092601', 6, '[\"Excused Tardiness\"]', '[{\"file\":\"1-06092601.jpg\"},{\"file\":\"2-06092601.jpg\"},{\"file\":\"3-06092601.jpg\"}]', 'Ex vero eligendi quisquam ipsam possimus et sit.', NULL, NULL, '2026-06-12 09:48:38', '2026-06-10', '2026-06-12', '2031-06-12 09:48:38', '2026-06-09 01:48:38'),
(19, '03062601', 10, '[\"Excused Tardiness\"]', '[{\"file\":\"1-03062601.jpg\"},{\"file\":\"2-03062601.jpg\"},{\"file\":\"3-03062601.jpg\"}]', 'Est autem sed sunt optio.', NULL, NULL, '2026-03-07 04:51:27', '2026-03-07', '2026-03-09', '2031-03-07 04:51:27', '2026-03-05 20:51:27'),
(20, '03022601', 28, '[\"Excused Absence\"]', '[{\"file\":\"1-03022601.jpg\"},{\"file\":\"2-03022601.jpg\"},{\"file\":\"3-03022601.jpg\"}]', 'Neque deserunt esse maxime hic ab.', 'Numquam assumenda dolorem qui accusamus magni cum ipsa.', '2026-03-05 18:21:41', NULL, '2026-03-03', '2026-03-03', '2031-03-05 18:21:41', '2026-03-02 10:21:41'),
(21, '03262601', 28, '[\"Excused Tardiness\"]', '[{\"file\":\"1-03262601.jpg\"},{\"file\":\"2-03262601.jpg\"},{\"file\":\"3-03262601.jpg\"}]', NULL, NULL, NULL, NULL, '2026-03-27', '2026-03-29', NULL, '2026-03-26 02:01:32'),
(22, '03162601', 5, '[\"Excused Tardiness\"]', '[{\"file\":\"1-03162601.jpg\"},{\"file\":\"2-03162601.jpg\"}]', 'Animi totam nam ut fugit laudantium debitis saepe.', NULL, NULL, '2026-03-18 04:23:28', '2026-03-17', '2026-03-18', '2031-03-18 04:23:28', '2026-03-15 20:23:28'),
(23, '10272501', 29, '[\"Excused Tardiness\"]', '[{\"file\":\"1-10272501.jpg\"},{\"file\":\"2-10272501.jpg\"}]', 'Sed nostrum et suscipit ut ullam.', 'Et animi qui quo quia autem laboriosam minima ut quasi occaecati.', '2025-10-29 04:33:27', NULL, '2025-10-28', '2025-10-30', '2030-10-29 04:33:27', '2025-10-26 20:33:27'),
(24, '05152602', 9, '[\"Excused Absence\"]', '[{\"file\":\"1-05152602.jpg\"},{\"file\":\"2-05152602.jpg\"}]', 'Id cumque ut totam omnis.', NULL, NULL, '2026-05-17 08:29:03', '2026-05-16', '2026-05-18', '2031-05-17 08:29:03', '2026-05-15 00:29:03'),
(25, '11132501', 9, '[\"Excused Absence\"]', '[{\"file\":\"1-11132501.jpg\"},{\"file\":\"2-11132501.jpg\"}]', NULL, NULL, NULL, NULL, '2025-11-14', '2025-11-15', NULL, '2025-11-13 09:17:15');

-- --------------------------------------------------------

--
-- Table structure for table `action_log`
--

CREATE TABLE `action_log` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `action_type` varchar(25) NOT NULL,
  `details` longtext NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `action_log`
--

INSERT INTO `action_log` (`id`, `user_id`, `action_type`, `details`, `created_at`) VALUES
(1, 2, 'login', 'logs in to the system', '2026-09-03 02:58:23'),
(2, 2, 'login', 'logs in to the system', '2026-09-03 07:55:20'),
(3, 2, 'login', 'logs in to the system', '2026-09-03 15:52:56'),
(4, 1, 'login', 'logs in to the system', '2026-09-04 05:30:46');

-- --------------------------------------------------------

--
-- Table structure for table `appointment`
--

CREATE TABLE `appointment` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `date_time_appoint` datetime DEFAULT NULL,
  `appointment_status` enum('pending','rejected','accepted') NOT NULL DEFAULT 'pending',
  `rejected_reason` text DEFAULT NULL,
  `confirmed_at` datetime DEFAULT NULL,
  `description` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `appointment`
--

INSERT INTO `appointment` (`id`, `user_id`, `date_time_appoint`, `appointment_status`, `rejected_reason`, `confirmed_at`, `description`, `created_at`) VALUES
(1, 19, '2026-07-26 14:30:00', 'accepted', NULL, '2026-07-28 23:40:56', 'Aliquam nisi et quo animi velit blanditiis dolor amet possimus et expedita dolor.', '2026-07-25 15:40:56'),
(2, 13, '2026-04-29 16:00:00', 'pending', NULL, NULL, 'Reiciendis odio repellendus sed dolorem doloremque architecto voluptatem et et at assumenda.', '2026-04-18 20:44:41'),
(3, 17, '2026-09-06 13:30:00', 'accepted', NULL, '2026-09-01 10:45:33', 'Facere iste inventore impedit error quia expedita.', '2026-08-31 02:45:33'),
(4, 9, '2026-05-24 15:15:00', 'accepted', NULL, '2026-05-16 21:25:50', 'Qui unde accusamus impedit beatae impedit inventore quia expedita soluta amet similique ratione.', '2026-05-15 13:25:50'),
(5, 28, '2026-04-06 14:45:00', 'accepted', NULL, '2026-04-02 17:18:08', 'Voluptatibus ea vel inventore eaque ab nemo quisquam officiis ex.', '2026-03-31 09:18:08'),
(6, 16, '2026-06-20 13:30:00', 'rejected', 'Ipsum aperiam quaerat voluptas quasi velit qui commodi ut excepturi assumenda.', '2026-06-18 19:41:39', 'Reprehenderit dolores alias sequi architecto omnis ut debitis.', '2026-06-17 11:41:39'),
(7, 22, '2026-07-28 15:30:00', 'pending', NULL, NULL, 'Nihil illum vero iure sint et dicta eveniet.', '2026-07-22 15:59:28'),
(8, 3, '2026-04-14 12:15:00', 'pending', NULL, NULL, 'Nam in aliquam mollitia voluptatem veniam perspiciatis magnam molestiae cupiditate quis ab.', '2026-04-08 01:17:36'),
(9, 30, '2026-03-11 13:45:00', 'accepted', NULL, '2026-03-12 13:25:33', 'Error et nesciunt maxime doloremque sapiente tempora.', '2026-03-10 05:25:33'),
(10, 11, '2026-07-24 14:30:00', 'pending', NULL, NULL, 'Sint sed voluptatem et fugit autem in tempora.', '2026-07-15 01:01:03'),
(11, 25, '2026-03-14 14:00:00', 'rejected', 'Voluptas aut debitis dolor molestiae qui inventore.', '2026-03-10 18:20:25', 'Non eius eum nisi magnam iusto voluptates autem similique illo consequatur autem nesciunt.', '2026-03-08 10:20:25'),
(12, 14, '2026-04-12 13:30:00', 'rejected', 'Explicabo molestiae sint sit culpa molestiae sit quaerat dolorem et neque.', '2026-04-09 21:48:07', 'Ut voluptas vel temporibus nobis necessitatibus sit ipsam quia illum qui praesentium.', '2026-04-06 13:48:07'),
(13, 19, '2026-08-28 15:30:00', 'rejected', 'Itaque tempora molestiae ea ipsa non aut quasi corporis harum.', '2026-08-24 11:29:25', 'Et amet ad autem dolores porro voluptates tenetur dolor ex.', '2026-08-23 03:29:25'),
(14, 10, '2026-04-22 14:15:00', 'rejected', 'Repudiandae eum aut amet et optio.', '2026-04-18 14:12:03', 'Repudiandae mollitia vero veritatis ut quaerat quibusdam necessitatibus perferendis nihil eveniet quia sint dolorem.', '2026-04-15 06:12:03'),
(15, 31, '2026-05-31 12:00:00', 'accepted', NULL, '2026-06-01 15:36:08', 'Maiores et aliquam maiores repudiandae in dolor nostrum.', '2026-05-29 07:36:08'),
(16, 18, '2026-08-20 13:30:00', 'accepted', NULL, '2026-08-13 01:01:48', 'Totam iste sit sed quis minus ut eveniet.', '2026-08-11 17:01:48'),
(17, 29, '2026-08-19 12:00:00', 'accepted', NULL, '2026-08-11 11:54:33', 'Voluptatem qui quaerat minus ut sit harum quis cum a ullam nulla.', '2026-08-10 03:54:33'),
(18, 22, '2026-07-14 10:00:00', 'pending', NULL, NULL, 'Ratione quibusdam quos et accusantium pariatur aut.', '2026-07-07 23:37:45'),
(19, 27, '2026-04-06 15:30:00', 'pending', NULL, NULL, 'Et vel alias et error repudiandae debitis quis suscipit veniam dicta et soluta.', '2026-04-05 13:37:31'),
(20, 10, '2026-07-26 12:30:00', 'accepted', NULL, '2026-07-23 06:03:59', 'Doloremque perspiciatis soluta esse sed enim sit reiciendis velit dicta.', '2026-07-20 22:03:59');

-- --------------------------------------------------------

--
-- Table structure for table `appointment_student`
--

CREATE TABLE `appointment_student` (
  `appointment_id` int(10) UNSIGNED NOT NULL,
  `student_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('laravel-cache-maintenance_mode', 'b:0;', 2103866052);

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `call_in`
--

CREATE TABLE `call_in` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `student_id` bigint(20) UNSIGNED NOT NULL,
  `issued_by` bigint(20) UNSIGNED NOT NULL,
  `date_time_call_in` datetime DEFAULT NULL,
  `reason` text NOT NULL,
  `call_in_status` enum('pending','rejected','accepted') NOT NULL DEFAULT 'pending',
  `rejected_reason` text DEFAULT NULL,
  `confirmed_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `complaint`
--

CREATE TABLE `complaint` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `complaint_number` varchar(255) NOT NULL,
  `case_number` int(11) DEFAULT NULL,
  `complainant_name` varchar(255) DEFAULT NULL,
  `complainant_id` bigint(20) UNSIGNED DEFAULT NULL,
  `incident_id` bigint(20) UNSIGNED DEFAULT NULL,
  `complaint_description` text NOT NULL,
  `complaint_evidences` longtext DEFAULT NULL,
  `rejected_reason` longtext DEFAULT NULL,
  `rejected_at` datetime DEFAULT NULL,
  `confirmed_at` datetime DEFAULT NULL,
  `offense_issued_at` datetime DEFAULT NULL,
  `complaint_status` enum('rejected','pending','ongoing','resolved') NOT NULL DEFAULT 'pending',
  `resolved_at` datetime DEFAULT NULL,
  `archived_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `complaint`
--

INSERT INTO `complaint` (`id`, `complaint_number`, `case_number`, `complainant_name`, `complainant_id`, `incident_id`, `complaint_description`, `complaint_evidences`, `rejected_reason`, `rejected_at`, `confirmed_at`, `offense_issued_at`, `complaint_status`, `resolved_at`, `archived_at`, `created_at`) VALUES
(1, '12042501', 6260, NULL, 6, 17, 'Blanditiis commodi nostrum ut quidem quod nam. Et adipisci veniam dolores facere. Est est recusandae illum ipsum nobis ut.', '[{\"type\":\"pic\",\"file\":\"1-12042501.jpg\"}]', NULL, NULL, '2025-12-05 10:52:11', '2025-12-04 10:52:11', 'resolved', '2025-12-13 10:52:11', '2030-12-05 10:52:11', '2025-12-04 02:52:11'),
(2, '02022601', 4009, NULL, 36, 10, 'Aspernatur voluptatum qui atque rerum voluptas molestias. Eligendi consequatur ducimus tenetur quae assumenda dolor et dolores.', '[{\"type\":\"pic\",\"file\":\"1-02022601.jpg\"}]', NULL, NULL, '2026-02-05 23:19:34', '2026-02-02 23:19:34', 'ongoing', NULL, NULL, '2026-02-02 15:19:34'),
(3, '10142501', 3785, NULL, 29, 3, 'Possimus porro voluptatem ullam possimus qui laboriosam. Qui rerum itaque aspernatur quaerat magni voluptas quod.', '[{\"type\":\"pic\",\"file\":\"1-10142501.jpg\"},{\"type\":\"pic\",\"file\":\"2-10142501.jpg\"}]', NULL, NULL, '2025-10-18 10:25:28', '2025-10-14 10:25:28', 'resolved', '2025-10-24 10:25:28', '2030-10-18 10:25:28', '2025-10-14 02:25:28'),
(4, '05142601', 3903, NULL, 17, 6, 'Accusantium dolore ut voluptatem dicta et cumque neque. Autem eum in ut eveniet.', '[{\"type\":\"pic\",\"file\":\"1-05142601.jpg\"},{\"type\":\"pic\",\"file\":\"2-05142601.jpg\"}]', NULL, NULL, '2026-05-19 00:34:35', '2026-05-14 00:34:35', 'resolved', '2026-05-23 00:34:35', '2031-05-19 00:34:35', '2026-05-13 16:34:35'),
(5, '02122601', 9937, NULL, 24, 12, 'Fuga eius aperiam repellat sed temporibus. Placeat quod sunt optio minima et. Sint eum eaque ut maiores.', '[{\"type\":\"pic\",\"file\":\"1-02122601.jpg\"},{\"type\":\"pic\",\"file\":\"2-02122601.jpg\"}]', NULL, NULL, '2026-02-14 21:42:40', '2026-02-12 21:42:40', 'ongoing', NULL, NULL, '2026-02-12 13:42:40'),
(6, '04152601', 5287, NULL, 47, 2, 'Iste autem beatae perspiciatis corrupti et maiores perferendis delectus. Nemo architecto ipsam animi iusto voluptates dolores atque. Alias eos aut nobis iusto enim ut.', '[{\"type\":\"pic\",\"file\":\"1-04152601.jpg\"},{\"type\":\"pic\",\"file\":\"2-04152601.jpg\"},{\"type\":\"pic\",\"file\":\"3-04152601.jpg\"}]', NULL, NULL, '2026-04-17 20:57:02', '2026-04-15 20:57:02', 'resolved', '2026-04-23 20:57:02', '2031-04-17 20:57:02', '2026-04-15 12:57:02'),
(7, '04212601', 3147, NULL, 8, 5, 'Quia illum molestiae necessitatibus nihil placeat. Nobis doloribus quasi aut.', '[{\"type\":\"pic\",\"file\":\"1-04212601.jpg\"},{\"type\":\"pic\",\"file\":\"2-04212601.jpg\"}]', NULL, NULL, '2026-04-26 21:06:25', '2026-04-21 21:06:25', 'resolved', '2026-05-05 21:06:25', '2031-04-26 21:06:25', '2026-04-21 13:06:25'),
(8, '11122501', 7206, NULL, 21, 9, 'Natus sunt adipisci autem. Voluptatem ipsum sequi a voluptatem expedita.', '[{\"type\":\"pic\",\"file\":\"1-11122501.jpg\"},{\"type\":\"pic\",\"file\":\"2-11122501.jpg\"}]', NULL, NULL, '2025-11-13 00:16:10', '2025-11-12 00:16:10', 'resolved', '2025-11-22 00:16:10', '2030-11-13 00:16:10', '2025-11-11 16:16:10'),
(9, '07292601', 3108, NULL, 8, 5, 'Quia eius quo voluptas architecto. Eius molestiae nulla omnis sed ad pariatur sapiente. Doloremque est rerum temporibus et labore qui minima.', '[{\"type\":\"pic\",\"file\":\"1-07292601.jpg\"},{\"type\":\"pic\",\"file\":\"2-07292601.jpg\"},{\"type\":\"pic\",\"file\":\"3-07292601.jpg\"}]', NULL, NULL, '2026-07-31 21:30:44', '2026-07-29 21:30:44', 'ongoing', NULL, NULL, '2026-07-29 13:30:44'),
(10, '08252601', 2070, NULL, 29, 5, 'Laborum impedit adipisci quis atque voluptas necessitatibus. Rerum excepturi blanditiis qui excepturi. Et ea at et rerum placeat.', '[{\"type\":\"pic\",\"file\":\"1-08252601.jpg\"},{\"type\":\"pic\",\"file\":\"2-08252601.jpg\"}]', NULL, NULL, '2026-08-27 09:13:07', '2026-08-25 09:13:07', 'ongoing', NULL, NULL, '2026-08-25 01:13:07'),
(11, '12252501', 9506, NULL, 17, 16, 'Voluptate voluptas magni possimus quis voluptatibus. Distinctio aut eos facere aperiam doloremque.', '[{\"type\":\"pic\",\"file\":\"1-12252501.jpg\"},{\"type\":\"pic\",\"file\":\"2-12252501.jpg\"}]', NULL, NULL, '2025-12-28 23:04:01', '2025-12-25 23:04:01', 'resolved', '2025-12-31 23:04:01', '2030-12-28 23:04:01', '2025-12-25 15:04:01'),
(12, '06142601', NULL, NULL, 25, 4, 'Eaque quod et impedit. Dolorem magnam nobis dicta ut.', '[{\"type\":\"pic\",\"file\":\"1-06142601.jpg\"},{\"type\":\"pic\",\"file\":\"2-06142601.jpg\"}]', NULL, NULL, NULL, '2026-06-14 09:37:21', 'pending', NULL, NULL, '2026-06-14 01:37:21'),
(13, '01302601', 8882, NULL, 29, 8, 'Dolore magnam ad et molestiae voluptatem pariatur ad. Qui sed enim iure enim dolores nihil quia quod. Ad in possimus aut.', '[{\"type\":\"pic\",\"file\":\"1-01302601.jpg\"},{\"type\":\"pic\",\"file\":\"2-01302601.jpg\"}]', NULL, NULL, '2026-02-01 09:58:03', '2026-01-30 09:58:03', 'resolved', '2026-02-03 09:58:03', '2031-02-01 09:58:03', '2026-01-30 01:58:03'),
(14, '06042601', NULL, NULL, 32, 6, 'Dicta autem dolor autem perferendis error. Asperiores recusandae voluptatem ratione et. Id quaerat molestias voluptatem sed.', '[{\"type\":\"pic\",\"file\":\"1-06042601.jpg\"},{\"type\":\"pic\",\"file\":\"2-06042601.jpg\"},{\"type\":\"pic\",\"file\":\"3-06042601.jpg\"}]', NULL, NULL, NULL, '2026-06-04 00:15:54', 'pending', NULL, NULL, '2026-06-03 16:15:54'),
(15, '10142502', 7230, NULL, 46, 19, 'Ipsam dolorem dolores eum id. Veritatis culpa quisquam qui voluptas. Pariatur sint architecto occaecati aperiam maiores eos.', '[{\"type\":\"pic\",\"file\":\"1-10142502.jpg\"}]', NULL, NULL, '2025-10-18 23:21:53', '2025-10-14 23:21:53', 'ongoing', NULL, NULL, '2025-10-14 15:21:53'),
(16, '08052601', NULL, NULL, 44, 2, 'Sequi quas voluptatem magni soluta cum rerum porro. Sed perspiciatis quos dolorem nobis dolores eveniet quis. Tempore recusandae aliquid saepe iure aspernatur et.', '[{\"type\":\"pic\",\"file\":\"1-08052601.jpg\"},{\"type\":\"pic\",\"file\":\"2-08052601.jpg\"},{\"type\":\"pic\",\"file\":\"3-08052601.jpg\"}]', NULL, NULL, NULL, '2026-08-05 10:25:02', 'pending', NULL, NULL, '2026-08-05 02:25:02'),
(17, '03142601', 7097, NULL, 30, 20, 'Laborum dicta cumque reiciendis ducimus. Ut quia quos atque neque.', '[{\"type\":\"pic\",\"file\":\"1-03142601.jpg\"},{\"type\":\"pic\",\"file\":\"2-03142601.jpg\"}]', 'Debitis id molestiae eos dicta.', '2026-03-18 22:15:55', '2026-03-18 22:15:55', '2026-03-14 22:15:55', 'rejected', NULL, '2031-03-18 22:15:55', '2026-03-14 14:15:55'),
(18, '09222501', NULL, NULL, 25, 15, 'Voluptas recusandae aut et in dolorum harum eius. Vel unde quis recusandae aliquam autem qui.', '[{\"type\":\"pic\",\"file\":\"1-09222501.jpg\"}]', NULL, NULL, NULL, '2025-09-22 14:57:16', 'pending', NULL, NULL, '2025-09-22 06:57:16'),
(19, '07142601', 4691, NULL, 7, 13, 'Optio velit nam molestiae veniam. Ut autem illo sit voluptates. Non magnam labore voluptas cumque dicta.', '[{\"type\":\"pic\",\"file\":\"1-07142601.jpg\"},{\"type\":\"pic\",\"file\":\"2-07142601.jpg\"}]', 'Explicabo blanditiis ut eaque quasi repellat voluptatibus nam tenetur quis qui.', '2026-07-18 22:07:43', '2026-07-18 22:07:43', '2026-07-14 22:07:43', 'rejected', NULL, '2031-07-18 22:07:43', '2026-07-14 14:07:43'),
(20, '12032501', 2478, NULL, 36, 11, 'Atque ad at eius eum nihil modi. Perspiciatis doloribus dignissimos qui voluptatum eos neque. Maxime exercitationem molestias cumque molestias quasi sunt.', '[{\"type\":\"pic\",\"file\":\"1-12032501.jpg\"}]', NULL, NULL, '2025-12-05 11:28:20', '2025-12-03 11:28:20', 'ongoing', NULL, NULL, '2025-12-03 03:28:20'),
(21, '01272601', 3043, NULL, 5, 7, 'Tenetur ipsa deleniti quia nam molestias sed provident voluptatem. Velit eveniet illo quibusdam est in.', '[{\"type\":\"pic\",\"file\":\"1-01272601.jpg\"},{\"type\":\"pic\",\"file\":\"2-01272601.jpg\"},{\"type\":\"pic\",\"file\":\"3-01272601.jpg\"}]', NULL, NULL, '2026-01-28 16:22:32', '2026-01-27 16:22:32', 'resolved', '2026-02-02 16:22:32', '2031-01-28 16:22:32', '2026-01-27 08:22:32'),
(22, '03102601', NULL, NULL, 12, 2, 'Sint qui deleniti sequi doloribus. Quaerat voluptas atque ex repellendus voluptas minus. Voluptates molestiae delectus nemo.', '[{\"type\":\"pic\",\"file\":\"1-03102601.jpg\"}]', NULL, NULL, NULL, '2026-03-10 04:22:53', 'pending', NULL, NULL, '2026-03-09 20:22:53'),
(23, '04072601', NULL, NULL, 49, 2, 'Harum officia mollitia voluptates vel. Neque quos ut soluta ea.', '[{\"type\":\"pic\",\"file\":\"1-04072601.jpg\"}]', NULL, NULL, NULL, '2026-04-07 03:37:59', 'pending', NULL, NULL, '2026-04-06 19:37:59'),
(24, '02102601', 4560, NULL, 24, 17, 'Tempore qui velit ut id et temporibus consequatur aliquid. Facilis voluptatem iusto distinctio voluptas at et et sed. Porro deleniti et iusto et consequatur mollitia at.', '[{\"type\":\"pic\",\"file\":\"1-02102601.jpg\"},{\"type\":\"pic\",\"file\":\"2-02102601.jpg\"},{\"type\":\"pic\",\"file\":\"3-02102601.jpg\"}]', 'Quo autem iure similique qui.', '2026-02-15 08:34:30', '2026-02-15 08:34:30', '2026-02-10 08:34:30', 'rejected', NULL, '2031-02-15 08:34:30', '2026-02-10 00:34:30'),
(25, '02152601', NULL, NULL, 15, 14, 'Explicabo voluptatibus qui dolores eius non ullam alias maxime. Consequatur rerum nulla temporibus rerum nostrum. Vel commodi odio quo qui.', '[{\"type\":\"pic\",\"file\":\"1-02152601.jpg\"},{\"type\":\"pic\",\"file\":\"2-02152601.jpg\"}]', NULL, NULL, NULL, '2026-02-15 03:10:47', 'pending', NULL, NULL, '2026-02-14 19:10:47'),
(26, '12072501', NULL, NULL, 33, 20, 'Deleniti nihil sed illum ut. Et pariatur facilis ipsa. Nam ut id iure laborum.', '[{\"type\":\"pic\",\"file\":\"1-12072501.jpg\"},{\"type\":\"pic\",\"file\":\"2-12072501.jpg\"},{\"type\":\"pic\",\"file\":\"3-12072501.jpg\"}]', NULL, NULL, NULL, '2025-12-07 23:00:58', 'pending', NULL, NULL, '2025-12-07 15:00:58'),
(27, '08222601', 9190, NULL, 15, 11, 'Aut earum debitis enim ipsam sed temporibus. Molestiae non blanditiis voluptate repellendus mollitia.', '[{\"type\":\"pic\",\"file\":\"1-08222601.jpg\"}]', 'Laboriosam provident est consectetur autem qui voluptatem omnis quam aut.', '2026-08-25 18:05:53', '2026-08-25 18:05:53', '2026-08-22 18:05:53', 'rejected', NULL, '2031-08-25 18:05:53', '2026-08-22 10:05:53'),
(28, '04302601', 1803, NULL, 17, 11, 'Laudantium commodi deserunt numquam. Doloremque omnis nemo aut et officia architecto aut. Earum ea dicta officiis ut enim consequatur.', '[{\"type\":\"pic\",\"file\":\"1-04302601.jpg\"}]', NULL, NULL, '2026-05-04 22:28:32', '2026-04-30 22:28:32', 'ongoing', NULL, NULL, '2026-04-30 14:28:32'),
(29, '07232601', 9053, NULL, 14, 7, 'Aperiam voluptas quas sed nulla ad. Suscipit omnis ut eius voluptate beatae veniam delectus iste.', '[{\"type\":\"pic\",\"file\":\"1-07232601.jpg\"}]', 'Molestiae cum rerum magni voluptatem voluptates ut voluptas quia.', '2026-07-25 12:13:36', '2026-07-25 12:13:36', '2026-07-23 12:13:36', 'rejected', NULL, '2031-07-25 12:13:36', '2026-07-23 04:13:36'),
(30, '02062601', 1355, NULL, 35, 14, 'Laborum provident repellat dolorum ea voluptatibus et. Porro mollitia suscipit ipsam quibusdam.', '[{\"type\":\"pic\",\"file\":\"1-02062601.jpg\"}]', NULL, NULL, '2026-02-07 08:54:10', '2026-02-06 08:54:10', 'resolved', '2026-02-14 08:54:10', '2031-02-07 08:54:10', '2026-02-06 00:54:10'),
(31, '07092601', 2154, NULL, 28, 14, 'Enim amet earum repellat sit incidunt quia. Suscipit non qui recusandae nihil officia.', '[{\"type\":\"pic\",\"file\":\"1-07092601.jpg\"},{\"type\":\"pic\",\"file\":\"2-07092601.jpg\"},{\"type\":\"pic\",\"file\":\"3-07092601.jpg\"}]', NULL, NULL, '2026-07-14 09:47:42', '2026-07-09 09:47:42', 'resolved', '2026-07-17 09:47:42', '2031-07-14 09:47:42', '2026-07-09 01:47:42'),
(32, '05302601', NULL, NULL, 9, 1, 'Omnis error quia soluta aliquam ut vel fuga. Voluptatem maxime corporis aliquam nesciunt aliquid unde. At odit atque sunt non dolores veniam.', '[{\"type\":\"pic\",\"file\":\"1-05302601.jpg\"}]', NULL, NULL, NULL, '2026-05-30 09:01:52', 'pending', NULL, NULL, '2026-05-30 01:01:52'),
(33, '10252501', 3759, NULL, 4, 8, 'Mollitia dolorum debitis quam repellat sit architecto in. Velit dolor consequatur nisi sunt amet.', '[{\"type\":\"pic\",\"file\":\"1-10252501.jpg\"}]', NULL, NULL, '2025-10-28 16:30:08', '2025-10-25 16:30:08', 'ongoing', NULL, NULL, '2025-10-25 08:30:08'),
(34, '08052602', NULL, NULL, 1, 5, 'Sint id velit eligendi aperiam qui delectus aut. Aut eum et enim illo.', '[{\"type\":\"pic\",\"file\":\"1-08052602.jpg\"},{\"type\":\"pic\",\"file\":\"2-08052602.jpg\"}]', NULL, NULL, NULL, '2026-08-05 22:29:06', 'pending', NULL, NULL, '2026-08-05 14:29:06'),
(35, '12182501', 7805, NULL, 42, 11, 'Expedita aut doloremque consequatur dolor iure. Qui illum ipsa reiciendis provident ipsum ad.', '[{\"type\":\"pic\",\"file\":\"1-12182501.jpg\"},{\"type\":\"pic\",\"file\":\"2-12182501.jpg\"}]', 'Culpa hic animi corrupti adipisci consequatur ut et deleniti id autem.', '2025-12-20 10:25:45', '2025-12-20 10:25:45', '2025-12-18 10:25:45', 'rejected', NULL, '2030-12-20 10:25:45', '2025-12-18 02:25:45'),
(36, '10292501', 6035, NULL, 23, 14, 'Vitae suscipit nobis veniam sit cupiditate quia quibusdam. Impedit odio est hic qui.', '[{\"type\":\"pic\",\"file\":\"1-10292501.jpg\"},{\"type\":\"pic\",\"file\":\"2-10292501.jpg\"}]', NULL, NULL, '2025-11-01 19:18:14', '2025-10-29 19:18:14', 'ongoing', NULL, NULL, '2025-10-29 11:18:14'),
(37, '02222601', 8360, NULL, 46, 13, 'Voluptatum facere occaecati magni maiores sed. Tempore sint unde earum praesentium veritatis laudantium quo. Sint eveniet sint itaque beatae.', '[{\"type\":\"pic\",\"file\":\"1-02222601.jpg\"},{\"type\":\"pic\",\"file\":\"2-02222601.jpg\"},{\"type\":\"pic\",\"file\":\"3-02222601.jpg\"}]', NULL, NULL, '2026-02-24 23:38:40', '2026-02-22 23:38:40', 'ongoing', NULL, NULL, '2026-02-22 15:38:40'),
(38, '10032501', 5702, NULL, 40, 4, 'Consectetur quo error et consectetur similique dolor. Dolor aut illum eaque. Neque distinctio corporis dignissimos possimus.', '[{\"type\":\"pic\",\"file\":\"1-10032501.jpg\"},{\"type\":\"pic\",\"file\":\"2-10032501.jpg\"},{\"type\":\"pic\",\"file\":\"3-10032501.jpg\"}]', 'Nulla sunt est veniam blanditiis qui.', '2025-10-06 06:30:22', '2025-10-06 06:30:22', '2025-10-03 06:30:22', 'rejected', NULL, '2030-10-06 06:30:22', '2025-10-02 22:30:22'),
(39, '12222501', 6673, NULL, 19, 6, 'Eos illum velit consequatur reprehenderit et. Sint reiciendis ea aut nemo laboriosam dolor voluptas.', '[{\"type\":\"pic\",\"file\":\"1-12222501.jpg\"}]', NULL, NULL, '2025-12-25 20:15:09', '2025-12-22 20:15:09', 'resolved', '2026-01-04 20:15:09', '2030-12-25 20:15:09', '2025-12-22 12:15:09'),
(40, '07282601', NULL, NULL, 36, 10, 'Maiores molestiae nostrum quia eos blanditiis. Dolorem error voluptas illo architecto in ex voluptas. Quia autem reiciendis itaque inventore.', '[{\"type\":\"pic\",\"file\":\"1-07282601.jpg\"},{\"type\":\"pic\",\"file\":\"2-07282601.jpg\"},{\"type\":\"pic\",\"file\":\"3-07282601.jpg\"}]', NULL, NULL, NULL, '2026-07-28 18:51:52', 'pending', NULL, NULL, '2026-07-28 10:51:52');

-- --------------------------------------------------------

--
-- Table structure for table `complaint_revision`
--

CREATE TABLE `complaint_revision` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `complaint_id` bigint(20) UNSIGNED NOT NULL,
  `incident` text NOT NULL,
  `complaint_description` text NOT NULL,
  `complaint_evidences` longtext DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `complaint_subject`
--

CREATE TABLE `complaint_subject` (
  `complaint_id` bigint(20) UNSIGNED NOT NULL,
  `student_id` bigint(20) UNSIGNED NOT NULL,
  `incident_summary` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `complaint_subject`
--

INSERT INTO `complaint_subject` (`complaint_id`, `student_id`, `incident_summary`) VALUES
(1, 13, 'Sint officiis repellendus velit facilis et enim ut.'),
(2, 26, NULL),
(2, 18, NULL),
(3, 27, 'Delectus quis exercitationem iure nostrum doloribus sed.'),
(3, 13, 'Laudantium nobis eum autem debitis ut.'),
(4, 25, 'Recusandae provident atque fugit omnis sed iste impedit.'),
(5, 26, NULL),
(5, 12, NULL),
(6, 3, 'Magnam aspernatur at sit omnis et dolorum consequatur.'),
(6, 8, 'Aliquam veniam ea a distinctio est laudantium.'),
(7, 11, 'Provident fugit ex at unde quo possimus reiciendis alias.'),
(7, 28, 'Iure officiis est accusamus perspiciatis et ipsum facere.'),
(8, 16, 'Tempora praesentium blanditiis perferendis ut non.'),
(9, 18, NULL),
(9, 27, NULL),
(10, 4, NULL),
(11, 4, 'Provident est accusamus voluptatum magnam repellat voluptatem esse qui.'),
(11, 28, 'Facere a ipsa perferendis.'),
(12, 4, NULL),
(12, 10, NULL),
(13, 17, 'Assumenda voluptate expedita ullam numquam.'),
(14, 26, NULL),
(15, 18, NULL),
(16, 8, NULL),
(16, 13, NULL),
(17, 5, NULL),
(17, 19, NULL),
(18, 26, NULL),
(19, 8, NULL),
(19, 19, NULL),
(20, 14, NULL),
(21, 19, 'Tempora quasi quasi natus laudantium sit exercitationem.'),
(22, 23, NULL),
(23, 6, NULL),
(24, 9, NULL),
(24, 23, NULL),
(25, 12, NULL),
(25, 4, NULL),
(26, 19, NULL),
(26, 7, NULL),
(27, 10, NULL),
(28, 10, NULL),
(28, 15, NULL),
(29, 17, NULL),
(29, 7, NULL),
(30, 20, 'Voluptate nostrum quia aperiam quo tenetur.'),
(30, 29, 'Nihil reprehenderit et sunt sunt nisi ut.'),
(31, 23, 'Non ut amet eos autem dignissimos.'),
(32, 10, NULL),
(32, 12, NULL),
(33, 3, NULL),
(34, 11, NULL),
(34, 19, NULL),
(35, 17, NULL),
(35, 8, NULL),
(36, 19, NULL),
(36, 3, NULL),
(37, 14, NULL),
(38, 32, NULL),
(38, 28, NULL),
(39, 30, 'Omnis aut harum animi et ut a.'),
(39, 23, 'Cum necessitatibus et quaerat in molestiae consequuntur ut.'),
(40, 23, NULL),
(40, 21, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `complaint_subject_violation`
--

CREATE TABLE `complaint_subject_violation` (
  `complaint_id` bigint(20) UNSIGNED NOT NULL,
  `student_id` bigint(20) UNSIGNED NOT NULL,
  `violation_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `complaint_subject_violation`
--

INSERT INTO `complaint_subject_violation` (`complaint_id`, `student_id`, `violation_id`) VALUES
(1, 13, 17),
(3, 27, 3),
(3, 13, 3),
(4, 25, 6),
(6, 3, 2),
(6, 8, 2),
(7, 11, 5),
(7, 28, 5),
(8, 16, 9),
(11, 4, 16),
(11, 28, 16),
(13, 17, 8),
(21, 19, 7),
(30, 20, 14),
(30, 29, 14),
(31, 23, 14),
(39, 30, 6),
(39, 23, 6);

-- --------------------------------------------------------

--
-- Table structure for table `csv_import_row_results`
--

CREATE TABLE `csv_import_row_results` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `batch_id` varchar(255) NOT NULL,
  `row_index` int(10) UNSIGNED NOT NULL,
  `id_number` varchar(255) DEFAULT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `status` enum('success','error') NOT NULL,
  `message` text DEFAULT NULL,
  `export_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`export_data`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `education_background`
--

CREATE TABLE `education_background` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `student_id` bigint(20) UNSIGNED NOT NULL,
  `education_type` varchar(255) NOT NULL,
  `school_name` varchar(255) DEFAULT NULL,
  `school_address` varchar(255) DEFAULT NULL,
  `year_graduated` varchar(255) DEFAULT NULL,
  `transferee` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `education_background`
--

INSERT INTO `education_background` (`id`, `student_id`, `education_type`, `school_name`, `school_address`, `year_graduated`, `transferee`) VALUES
(1, 3, 'senior_high_school', NULL, NULL, NULL, 0),
(2, 3, 'college', NULL, NULL, NULL, 0),
(3, 4, 'senior_high_school', NULL, NULL, NULL, 0),
(4, 4, 'college', NULL, NULL, NULL, 0),
(5, 5, 'senior_high_school', NULL, NULL, NULL, 0),
(6, 5, 'college', NULL, NULL, NULL, 0),
(7, 6, 'senior_high_school', NULL, NULL, NULL, 0),
(8, 6, 'college', NULL, NULL, NULL, 0),
(9, 7, 'senior_high_school', NULL, NULL, NULL, 0),
(10, 7, 'college', NULL, NULL, NULL, 0),
(11, 8, 'senior_high_school', NULL, NULL, NULL, 0),
(12, 8, 'college', NULL, NULL, NULL, 0),
(13, 9, 'senior_high_school', NULL, NULL, NULL, 0),
(14, 9, 'college', NULL, NULL, NULL, 0),
(15, 10, 'senior_high_school', NULL, NULL, NULL, 0),
(16, 10, 'college', NULL, NULL, NULL, 0),
(17, 11, 'senior_high_school', NULL, NULL, NULL, 0),
(18, 11, 'college', NULL, NULL, NULL, 0),
(19, 12, 'senior_high_school', NULL, NULL, NULL, 0),
(20, 12, 'college', NULL, NULL, NULL, 0),
(21, 13, 'senior_high_school', NULL, NULL, NULL, 0),
(22, 13, 'college', NULL, NULL, NULL, 0),
(23, 14, 'senior_high_school', NULL, NULL, NULL, 0),
(24, 14, 'college', NULL, NULL, NULL, 0),
(25, 15, 'senior_high_school', NULL, NULL, NULL, 0),
(26, 15, 'college', NULL, NULL, NULL, 0),
(27, 16, 'senior_high_school', NULL, NULL, NULL, 0),
(28, 16, 'college', NULL, NULL, NULL, 0),
(29, 17, 'senior_high_school', NULL, NULL, NULL, 0),
(30, 17, 'college', NULL, NULL, NULL, 0),
(31, 18, 'senior_high_school', NULL, NULL, NULL, 0),
(32, 18, 'college', NULL, NULL, NULL, 0),
(33, 19, 'senior_high_school', NULL, NULL, NULL, 0),
(34, 19, 'college', NULL, NULL, NULL, 0),
(35, 20, 'senior_high_school', NULL, NULL, NULL, 0),
(36, 20, 'college', NULL, NULL, NULL, 0),
(37, 21, 'senior_high_school', NULL, NULL, NULL, 0),
(38, 21, 'college', NULL, NULL, NULL, 0),
(39, 22, 'senior_high_school', NULL, NULL, NULL, 0),
(40, 22, 'college', NULL, NULL, NULL, 0),
(41, 23, 'senior_high_school', NULL, NULL, NULL, 0),
(42, 23, 'college', NULL, NULL, NULL, 0),
(43, 24, 'senior_high_school', NULL, NULL, NULL, 0),
(44, 24, 'college', NULL, NULL, NULL, 0),
(45, 25, 'senior_high_school', NULL, NULL, NULL, 0),
(46, 25, 'college', NULL, NULL, NULL, 0),
(47, 26, 'senior_high_school', NULL, NULL, NULL, 0),
(48, 26, 'college', NULL, NULL, NULL, 0),
(49, 27, 'senior_high_school', NULL, NULL, NULL, 0),
(50, 27, 'college', NULL, NULL, NULL, 0),
(51, 28, 'senior_high_school', NULL, NULL, NULL, 0),
(52, 28, 'college', NULL, NULL, NULL, 0),
(53, 29, 'senior_high_school', NULL, NULL, NULL, 0),
(54, 29, 'college', NULL, NULL, NULL, 0),
(55, 30, 'senior_high_school', NULL, NULL, NULL, 0),
(56, 30, 'college', NULL, NULL, NULL, 0),
(57, 31, 'senior_high_school', NULL, NULL, NULL, 0),
(58, 31, 'college', NULL, NULL, NULL, 0),
(59, 32, 'senior_high_school', NULL, NULL, NULL, 0),
(60, 32, 'college', NULL, NULL, NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `enrollment`
--

CREATE TABLE `enrollment` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `student_id` bigint(20) UNSIGNED NOT NULL,
  `program_id` bigint(20) UNSIGNED NOT NULL,
  `school_year` varchar(255) NOT NULL,
  `semester` tinyint(3) UNSIGNED NOT NULL,
  `year_level` tinyint(3) UNSIGNED NOT NULL,
  `status` enum('enrolled','dropped') NOT NULL DEFAULT 'enrolled',
  `enrolled_at` date NOT NULL,
  `dropped_at` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ;

--
-- Dumping data for table `enrollment`
--

INSERT INTO `enrollment` (`id`, `student_id`, `program_id`, `school_year`, `semester`, `year_level`, `status`, `enrolled_at`, `dropped_at`, `created_at`) VALUES
(1, 3, 7, '2025-2026', 1, 2, 'enrolled', '2026-03-14', NULL, '2026-09-03 02:56:05'),
(2, 4, 6, '2025-2026', 1, 4, 'enrolled', '2026-07-15', NULL, '2026-09-03 02:56:05'),
(3, 5, 7, '2025-2026', 1, 3, 'enrolled', '2026-07-02', NULL, '2026-09-03 02:56:05'),
(4, 6, 3, '2025-2026', 1, 1, 'enrolled', '2026-08-01', NULL, '2026-09-03 02:56:05'),
(5, 7, 2, '2025-2026', 1, 1, 'enrolled', '2026-04-01', NULL, '2026-09-03 02:56:05'),
(6, 8, 6, '2025-2026', 1, 2, 'enrolled', '2026-03-20', NULL, '2026-09-03 02:56:05'),
(7, 9, 1, '2025-2026', 1, 1, 'enrolled', '2026-05-14', NULL, '2026-09-03 02:56:05'),
(8, 10, 4, '2025-2026', 1, 4, 'enrolled', '2026-03-21', NULL, '2026-09-03 02:56:05'),
(9, 11, 6, '2025-2026', 1, 2, 'enrolled', '2026-05-21', NULL, '2026-09-03 02:56:05'),
(10, 12, 7, '2025-2026', 1, 3, 'dropped', '2026-07-18', '2026-08-14', '2026-09-03 02:56:06'),
(11, 13, 4, '2025-2026', 1, 2, 'enrolled', '2026-03-18', NULL, '2026-09-03 02:56:06'),
(12, 14, 7, '2025-2026', 1, 2, 'enrolled', '2026-06-21', NULL, '2026-09-03 02:56:06'),
(13, 15, 6, '2025-2026', 1, 4, 'enrolled', '2026-05-11', NULL, '2026-09-03 02:56:06'),
(14, 16, 6, '2025-2026', 1, 4, 'enrolled', '2026-08-22', NULL, '2026-09-03 02:56:06'),
(15, 17, 7, '2025-2026', 1, 3, 'enrolled', '2026-03-09', NULL, '2026-09-03 02:56:06'),
(16, 18, 1, '2025-2026', 1, 1, 'enrolled', '2026-07-14', NULL, '2026-09-03 02:56:06'),
(17, 19, 2, '2025-2026', 1, 4, 'enrolled', '2026-05-15', NULL, '2026-09-03 02:56:06'),
(18, 20, 5, '2025-2026', 1, 4, 'enrolled', '2026-07-10', NULL, '2026-09-03 02:56:06'),
(19, 21, 2, '2025-2026', 1, 4, 'enrolled', '2026-06-07', NULL, '2026-09-03 02:56:06'),
(20, 22, 5, '2025-2026', 1, 2, 'dropped', '2026-06-24', '2026-08-22', '2026-09-03 02:56:06'),
(21, 23, 3, '2025-2026', 1, 3, 'enrolled', '2026-07-02', NULL, '2026-09-03 02:56:06'),
(22, 24, 3, '2025-2026', 1, 4, 'enrolled', '2026-06-01', NULL, '2026-09-03 02:56:06'),
(23, 25, 6, '2025-2026', 1, 4, 'enrolled', '2026-08-14', NULL, '2026-09-03 02:56:06'),
(24, 26, 2, '2025-2026', 1, 2, 'enrolled', '2026-03-13', NULL, '2026-09-03 02:56:06'),
(25, 27, 5, '2025-2026', 1, 2, 'enrolled', '2026-04-10', NULL, '2026-09-03 02:56:07'),
(26, 28, 2, '2025-2026', 1, 1, 'enrolled', '2026-08-09', NULL, '2026-09-03 02:56:07'),
(27, 29, 1, '2025-2026', 1, 3, 'enrolled', '2026-03-05', NULL, '2026-09-03 02:56:07'),
(28, 30, 1, '2025-2026', 1, 4, 'enrolled', '2026-04-02', NULL, '2026-09-03 02:56:07'),
(29, 31, 1, '2025-2026', 1, 4, 'enrolled', '2026-05-12', NULL, '2026-09-03 02:56:07'),
(30, 32, 6, '2025-2026', 1, 2, 'dropped', '2026-06-23', '2026-08-19', '2026-09-03 02:56:07');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` varchar(255) NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `family`
--

CREATE TABLE `family` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `family_code` varchar(255) DEFAULT NULL,
  `family_name` varchar(25) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `family_member`
--

CREATE TABLE `family_member` (
  `family_id` bigint(20) UNSIGNED NOT NULL,
  `member_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `gate_pass`
--

CREATE TABLE `gate_pass` (
  `id` int(10) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `reason` text NOT NULL,
  `allow_to` text DEFAULT NULL,
  `confirmed_at` datetime DEFAULT NULL,
  `date_expiration` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `gate_pass`
--

INSERT INTO `gate_pass` (`id`, `user_id`, `reason`, `allow_to`, `confirmed_at`, `date_expiration`, `created_at`) VALUES
(1, 16, 'Medical appointment', '[\"With companion\"]', NULL, NULL, '2026-08-10 21:11:40'),
(2, 9, 'Medical appointment', '[\"With companion\"]', '2026-03-15 18:02:48', '2026-03-15 23:02:48', '2026-03-15 08:02:48'),
(3, 7, 'Off-campus academic activity', '[\"Guardian pick-up\"]', '2026-07-30 23:32:02', '2026-07-31 07:32:02', '2026-07-30 12:32:02'),
(4, 4, 'Parent request', '[\"Guardian pick-up\"]', NULL, NULL, '2026-05-29 09:43:53'),
(5, 4, 'Off-campus academic activity', '[\"Solo release\"]', '2026-08-01 16:12:01', '2026-08-02 00:12:01', '2026-08-01 06:12:01'),
(6, 26, 'Off-campus academic activity', '[\"Solo release\"]', '2026-06-08 17:17:56', '2026-06-08 21:17:56', '2026-06-08 06:17:56'),
(7, 19, 'Family emergency', '[\"Solo release\"]', '2026-04-15 09:21:30', '2026-04-15 11:21:30', '2026-04-14 22:21:30'),
(8, 21, 'Parent request', '[\"With companion\"]', '2026-07-31 00:26:35', '2026-07-31 05:26:35', '2026-07-30 14:26:35'),
(9, 24, 'Parent request', '[\"With companion\"]', NULL, NULL, '2026-04-09 14:00:47'),
(10, 31, 'Family emergency', '[\"Guardian pick-up\"]', '2026-05-18 12:13:26', '2026-05-18 20:13:26', '2026-05-17 23:13:26'),
(11, 28, 'School-related errand', '[\"With companion\"]', '2026-03-06 13:23:24', '2026-03-06 19:23:24', '2026-03-06 01:23:24'),
(12, 12, 'Medical appointment', '[\"With companion\"]', '2026-06-24 15:40:09', '2026-06-24 20:40:09', '2026-06-24 04:40:09'),
(13, 25, 'Medical appointment', '[\"With companion\"]', '2026-06-02 13:27:14', '2026-06-02 16:27:14', '2026-06-01 23:27:14'),
(14, 31, 'Family emergency', '[\"Solo release\"]', '2026-04-25 15:19:07', '2026-04-25 21:19:07', '2026-04-25 06:19:07'),
(15, 11, 'Medical appointment', '[\"Solo release\"]', NULL, NULL, '2026-08-12 03:36:07'),
(16, 12, 'Parent request', '[\"With companion\"]', '2026-04-14 21:10:29', '2026-04-15 00:10:29', '2026-04-14 12:10:29'),
(17, 21, 'Family emergency', '[\"With companion\"]', NULL, NULL, '2026-04-04 17:23:40'),
(18, 24, 'Parent request', '[\"With companion\"]', NULL, NULL, '2026-06-04 01:12:41'),
(19, 9, 'Family emergency', '[\"Solo release\"]', '2026-07-11 01:09:23', '2026-07-11 08:09:23', '2026-07-10 13:09:23'),
(20, 14, 'School-related errand', '[\"Solo release\"]', '2026-08-05 23:57:31', '2026-08-06 07:57:31', '2026-08-05 13:57:31');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` smallint(5) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '0001_01_01_000003_create_profiles_table', 1),
(5, '0001_01_01_000004_create_user_permissions_table', 1),
(6, '0001_01_01_000005_create_program_table', 1),
(7, '0001_01_01_000006_create_family_table', 1),
(8, '0001_01_01_000007_create_family_member_table', 1),
(9, '0001_01_01_000009_create_teaching_staff_table', 1),
(10, '0001_01_01_000011_create_parent_table', 1),
(11, '0001_01_01_000013_create_education_background_table', 1),
(12, '0001_01_01_000014_create_violation_table', 1),
(13, '0001_01_01_000015_create_penalty_table', 1),
(14, '0001_01_01_000016_create_violation_penalty_table', 1),
(15, '0001_01_01_000017_create_absent_table', 1),
(16, '0001_01_01_000018_create_action_log_table', 1),
(17, '0001_01_01_000019_create_appointment_table', 1),
(18, '0001_01_01_000020_create_gate_pass_table', 1),
(19, '0001_01_01_000021_create_referral_table', 1),
(20, '0001_01_01_000022_create_referral_referred_student_table', 1),
(21, '0001_01_01_000023_create_complaint_table', 1),
(22, '0001_01_01_000024_create_complaint_subject_table', 1),
(23, '0001_01_01_000025_create_complaint_subject_offense_table', 1),
(24, '0001_01_01_000026_create_notification_table', 1),
(25, '0001_01_01_000027_create_parent_registration_request_table', 1),
(26, '0001_01_01_000029_create_enrollment_table', 1),
(27, '0001_01_01_000030_create_call_in_table', 1),
(28, '0001_01_01_000031_create_appointment_student_table', 1),
(29, '0001_01_01_000032_create_complaint_revision_table', 1),
(30, '2026_08_31_140836_create_csv_import_row_results_table', 1),
(31, '2026_09_02_011653_create_push_subscriptions_table', 1),
(32, '2026_09_02_011653_increase_push_subscriptions_endpoint_length', 1),
(33, '2026_09_03_000000_add_offense_issued_at_to_complaint_table', 2),
(36, '2026_09_03_010000_create_report_table', 3);

-- --------------------------------------------------------

--
-- Table structure for table `notification`
--

CREATE TABLE `notification` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `sender_id` bigint(20) UNSIGNED DEFAULT NULL,
  `receiver_id` bigint(20) UNSIGNED NOT NULL,
  `notif_type` enum('complaint','referral','absent','violation','appointment','gatepass','call_in','user') NOT NULL,
  `content` text NOT NULL,
  `notifiable_type` varchar(255) DEFAULT NULL,
  `notifiable_id` bigint(20) UNSIGNED DEFAULT NULL,
  `read_since` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `parent`
--

CREATE TABLE `parent` (
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `parent_role` varchar(255) NOT NULL,
  `work_occupation` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `parent_registration_request`
--

CREATE TABLE `parent_registration_request` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `parent_details` longtext DEFAULT NULL,
  `reason` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `penalty`
--

CREATE TABLE `penalty` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `ref_number` decimal(10,2) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `penalty`
--

INSERT INTO `penalty` (`id`, `ref_number`, `name`, `description`, `created_at`) VALUES
(1, 1.00, 'Verbal Warning', 'Verbal Warning', '2026-09-03 02:56:02'),
(2, 2.00, 'Written Warning', 'Written Warning', '2026-09-03 02:56:02'),
(3, 3.00, 'Parent Conference', 'Parent/Guardian Conference', '2026-09-03 02:56:02'),
(4, 4.00, 'Community Service', 'Community Service (4 Hours)', '2026-09-03 02:56:02'),
(5, 5.00, 'Suspension (3 Days)', 'Suspension for 3 Days', '2026-09-03 02:56:02'),
(6, 6.00, 'Suspension (1 Week)', 'Suspension for 1 Week', '2026-09-03 02:56:02'),
(7, 7.00, 'Suspension (2 Weeks)', 'Suspension for 2 Weeks', '2026-09-03 02:56:02'),
(8, 8.00, 'Expulsion Recommendation', 'Recommendation for Expulsion', '2026-09-03 02:56:02');

-- --------------------------------------------------------

--
-- Table structure for table `profiles`
--

CREATE TABLE `profiles` (
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `middle_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) NOT NULL,
  `suffix` varchar(255) DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `sex` enum('m','f') DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `civil_status` varchar(255) DEFAULT NULL,
  `religion` varchar(255) DEFAULT NULL,
  `citizenship` varchar(255) DEFAULT NULL,
  `current_address` varchar(255) DEFAULT NULL,
  `permanent_address` varchar(255) DEFAULT NULL,
  `place_of_birth` varchar(255) DEFAULT NULL,
  `contact_number` varchar(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `profiles`
--

INSERT INTO `profiles` (`user_id`, `first_name`, `middle_name`, `last_name`, `suffix`, `profile_picture`, `sex`, `date_of_birth`, `civil_status`, `religion`, `citizenship`, `current_address`, `permanent_address`, `place_of_birth`, `contact_number`) VALUES
(1, 'Super', NULL, 'Admin', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '4508 Martina Ridges\nBessiefort, LA 38036-9948', '4508 Martina Ridges\nBessiefort, LA 38036-9948', NULL, NULL),
(2, 'Sub', NULL, 'Admin', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '737 Aufderhar Port\nNew Hattie, NC 89783', '737 Aufderhar Port\nNew Hattie, NC 89783', NULL, NULL),
(3, 'Billy', 'Daniel', 'Ullrich', NULL, NULL, 'm', '2008-02-19', 'single', NULL, NULL, '1528 Kirlin Road\nSouth Amparo, AR 72504', '36547 Effertz Forks Apt. 102\nHamillport, OR 71347', NULL, '09681981170'),
(4, 'Judy', 'Schiller', 'Murphy', NULL, NULL, 'f', '2005-05-19', 'single', NULL, NULL, '838 Sporer Court Apt. 231\nEast Hildegardport, NH 14570', '44115 Ludie Causeway\nPort Robbie, KY 45912-2020', NULL, '09658731638'),
(5, 'Damian', 'Littel', 'Schaefer', NULL, NULL, 'm', '2008-06-05', 'single', NULL, NULL, '20073 Elsa Junctions\nPort Dolly, MS 36758', '670 McDermott Island\nNorth Ryderstad, GA 99048-6979', NULL, '09628551776'),
(6, 'Cielo', 'Welch', 'Reichel', NULL, NULL, 'm', '2008-04-20', 'single', NULL, NULL, '118 Melyna Summit Suite 798\nBalistreriland, MA 81369', '5987 Kari Meadow\nEast Javierhaven, CO 16487-0241', NULL, '09357183745'),
(7, 'Josiane', 'Bartoletti', 'Carter', NULL, NULL, 'f', '2005-07-29', 'single', NULL, NULL, '711 Jefferey Plains Suite 452\nPort Scotty, WI 69310-0130', '51666 Vivien Mission Apt. 305\nHoraceborough, VT 00003-1941', NULL, '09538326981'),
(8, 'Lauretta', 'Lind', 'Barrows', NULL, NULL, 'f', '2004-09-24', 'single', NULL, NULL, '6031 Hoeger Plains\nDouglasberg, MI 55177', '171 Walsh Place Apt. 310\nKovacekborough, ND 06410', NULL, '09934383934'),
(9, 'Enoch', 'Streich', 'Brekke', NULL, NULL, 'm', '2005-10-15', 'single', NULL, NULL, '49425 Rowe Street\nJacobibury, WI 62635', '675 Raphael Viaduct\nSouth Golda, VA 65775', NULL, '09380070006'),
(10, 'Ray', 'Mante', 'Ward', NULL, NULL, 'm', '2007-04-30', 'single', NULL, NULL, '89771 Kutch Shores\nTremblayton, FL 59329-1265', '997 Cassandre Street Apt. 509\nEast Dock, MD 30798', NULL, '09079205660'),
(11, 'Rowland', 'Pouros', 'Keebler', NULL, NULL, 'm', '2009-07-09', 'single', NULL, NULL, '786 Sporer Road Apt. 526\nNikolausfort, IL 23638-6547', '252 Joy Point Apt. 555\nPort Kathlynland, FL 47355-7475', NULL, '09558474095'),
(12, 'Emil', 'Langworth', 'Stark', NULL, NULL, 'm', '2009-04-22', 'single', NULL, NULL, '6482 Christa Road\nEast Breana, CT 23888', '527 Nathanial Cliffs\nQuigleybury, DC 24792-6782', NULL, '09103701117'),
(13, 'Novella', 'Beahan', 'Flatley', NULL, NULL, 'f', '2006-12-18', 'single', NULL, NULL, '6961 Kihn Forges\nNew Jadonchester, IA 86043-1134', '85574 Smith Center Suite 043\nWest Georgiannafort, RI 90092-8117', NULL, '09139431440'),
(14, 'Deborah', 'Heidenreich', 'Maggio', NULL, NULL, 'f', '2006-04-07', 'single', NULL, NULL, '5075 Santos Valleys\nBoylemouth, SC 78215-9872', '72972 Oswaldo Canyon\nGraycechester, MT 46553-1514', NULL, '09741859807'),
(15, 'Davonte', 'Carter', 'Feeney', NULL, NULL, 'm', '2006-07-06', 'single', NULL, NULL, '1550 Sporer Street Suite 187\nVergieton, WI 97118-9053', '86446 Johnston Village\nNorth Carolynefort, NJ 78728', NULL, '09186082473'),
(16, 'Kasey', 'Schuppe', 'Jenkins', NULL, NULL, 'f', '2005-04-17', 'single', NULL, NULL, '13013 Hill Neck Apt. 414\nNew Aron, MT 42957', '6496 Bogisich Ferry\nNellechester, WV 76533-5167', NULL, '09608639623'),
(17, 'Ofelia', 'Grant', 'Grant', NULL, NULL, 'f', '2003-12-19', 'single', NULL, NULL, '510 Dare Pine\nGuiseppebury, ND 83636-1985', '855 Cremin Shoal\nRusselchester, ME 32405-3580', NULL, '09624240897'),
(18, 'Alf', 'Botsford', 'Wehner', NULL, NULL, 'm', '2004-11-01', 'single', NULL, NULL, '49466 Kianna Underpass\nWest Molly, VA 95856-3396', '1756 Abbott Coves\nZolabury, VT 56157-6625', NULL, '09685878368'),
(19, 'Savannah', 'Lakin', 'Padberg', NULL, NULL, 'f', '2006-11-16', 'single', NULL, NULL, '78090 Klein Hill Suite 783\nDemarioside, MA 16421', '207 Kathlyn Prairie Suite 177\nSouth Adeline, AK 25531-6569', NULL, '09472984935'),
(20, 'Lottie', 'Willms', 'Reinger', NULL, NULL, 'f', '2002-10-19', 'single', NULL, NULL, '9014 Allene Lakes Suite 669\nNorth Aniyah, MI 29461-2448', '6021 Mitchel Point Apt. 756\nParisianside, MA 57396-6713', NULL, '09187660100'),
(21, 'Omari', 'Reichert', 'Lubowitz', NULL, NULL, 'm', '2007-04-21', 'single', NULL, NULL, '725 Torp Coves Suite 400\nEast Tryciabury, WV 62162', '793 Hammes Greens Apt. 647\nNew Kattie, WV 10819', NULL, '09748636160'),
(22, 'Wava', 'Stiedemann', 'Mayer', NULL, NULL, 'f', '2008-02-19', 'single', NULL, NULL, '9253 Ava Parks Apt. 958\nBalistreribury, WV 74332-1100', '62095 Ebert Islands Apt. 722\nDooleyshire, WA 71686-6212', NULL, '09582579784'),
(23, 'Jerel', 'Wilderman', 'Schroeder', NULL, NULL, 'm', '2004-09-28', 'single', NULL, NULL, '47500 Will Junctions\nWildermanberg, IN 45223-2617', '930 Shaina Brook Suite 861\nEast Carliburgh, PA 55459-5236', NULL, '09927048940'),
(24, 'Casey', 'Cummings', 'Swift', NULL, NULL, 'm', '2006-12-25', 'single', NULL, NULL, '511 Gunnar Lake\nNorth Arnold, OH 40091-2318', '5159 Erdman Wells\nJaylanmouth, MI 05164', NULL, '09729830618'),
(25, 'Garrison', 'Hagenes', 'Bartoletti', NULL, NULL, 'm', '2004-02-15', 'single', NULL, NULL, '92289 Torphy Club Apt. 644\nKoeppmouth, AL 14638', '31003 Chelsey Flat\nEvansfort, UT 11609', NULL, '09694883649'),
(26, 'Alba', 'Hagenes', 'Wiza', NULL, NULL, 'f', '2007-04-30', 'single', NULL, NULL, '15970 Kayley Neck Suite 262\nWest Modestohaven, OH 43173', '8724 Shaylee Key Apt. 367\nJohnsonfort, MA 14480', NULL, '09449609780'),
(27, 'Alice', 'Baumbach', 'Corkery', NULL, NULL, 'f', '2007-03-05', 'single', NULL, NULL, '87586 Claudie Mission\nPort Roselyn, GA 93414', '8918 Rau Port\nOrinland, AL 12031', NULL, '09573923137'),
(28, 'Kaylee', 'Paucek', 'Price', NULL, NULL, 'f', '2003-05-17', 'single', NULL, NULL, '49071 Langworth Fort Apt. 618\nBalistreristad, DE 96980', '1312 Jones Stravenue Suite 562\nD\'Amoreberg, DC 05612-1500', NULL, '09622687158'),
(29, 'May', 'Durgan', 'Renner', NULL, NULL, 'f', '2005-03-30', 'single', NULL, NULL, '2318 Zula Forks Suite 445\nTyreekside, AZ 16374', '5229 Hermiston Tunnel\nSporerburgh, GA 95702-2823', NULL, '09473246341'),
(30, 'Jasper', 'Durgan', 'Aufderhar', NULL, NULL, 'm', '2005-11-16', 'single', NULL, NULL, '37492 Mallory Unions Suite 888\nCarmelchester, OH 80260', '3647 Hahn Light\nHalvorsontown, ND 25299', NULL, '09788069901'),
(31, 'Cindy', 'McKenzie', 'O\'Kon', NULL, NULL, 'f', '2006-03-21', 'single', NULL, NULL, '554 Sigurd Plains\nWest Dannie, SD 78496', '46724 Muller Pines Apt. 085\nWest Noemychester, MI 60907', NULL, '09984219873'),
(32, 'Nathanial', 'Jaskolski', 'Swift', NULL, NULL, 'm', '2002-10-10', 'single', NULL, NULL, '943 Etha Junctions Apt. 000\nPort Mattie, MA 12635-3782', '2084 Ward Bypass\nMarjorieview, CO 48948', NULL, '09309047014'),
(33, 'Tommie', 'Abshire', 'Dickinson', NULL, NULL, 'm', '1980-11-23', 'married', NULL, NULL, '7472 Powlowski Flats\nLillieview, AK 60406', '219 Nicolas Springs\nToymouth, MI 83844-5180', NULL, '09853815456'),
(34, 'Tatyana', 'Witting', 'Bernhard', NULL, NULL, 'f', '1971-07-12', 'married', NULL, NULL, '92671 Gottlieb Vista Suite 560\nSouth Crystel, NH 75991-6195', '95336 Carroll Station\nKunzefort, AZ 96004-7033', NULL, '09721616476'),
(35, 'Geraldine', 'Rowe', 'Hand', NULL, NULL, 'f', '1988-11-22', 'married', NULL, NULL, '1600 Haag Island Apt. 445\nLaurenberg, ME 97309-8427', '93215 Spinka Trail\nSouth Lilianahaven, IN 45392-8354', NULL, '09315857140'),
(36, 'Alysha', 'Ward', 'Jerde', NULL, NULL, 'f', '1973-07-11', 'single', NULL, NULL, '501 Karianne Well Suite 624\nSouth Zaria, IA 33726', '2080 Dicki Burg Suite 014\nOrionfurt, UT 00399', NULL, '09606524754'),
(37, 'Hollis', 'Wyman', 'Stiedemann', NULL, NULL, 'm', '1988-02-07', 'married', NULL, NULL, '61864 Veum Field\nLake Patrick, ME 75878', '715 Barry Pine Suite 109\nEast Destanyborough, NV 52082-4881', NULL, '09549941011'),
(38, 'Christian', 'Ortiz', 'Larkin', NULL, NULL, 'm', '1969-07-03', 'single', NULL, NULL, '135 Bradley Passage Apt. 692\nJedediahside, TN 56879-2219', '35644 Stiedemann Pines\nSouth Claudine, MS 76414-7680', NULL, '09056551849'),
(39, 'Augustus', 'Little', 'Quigley', NULL, NULL, 'm', '1966-11-07', 'single', NULL, NULL, '633 Elroy Via Apt. 148\nEast Flossiechester, NJ 23378', '42250 Adrian Summit Suite 329\nLake Grayce, SC 34012-7544', NULL, '09536612512'),
(40, 'Americo', 'Kemmer', 'Hermann', NULL, NULL, 'm', '1998-01-24', 'married', NULL, NULL, '521 Bauch Fort Apt. 049\nSouth Brycentown, CA 13677', '456 Selmer Shoals\nLake Jordan, WV 83849', NULL, '09007522745'),
(41, 'Lempi', 'Corwin', 'Romaguera', NULL, NULL, 'f', '1985-04-23', 'married', NULL, NULL, '67216 Zelda Roads Suite 985\nLake Chaseview, NH 60630-1153', '7047 Glover Plaza\nDuBuquechester, MT 87492', NULL, '09700503237'),
(42, 'Margarete', 'Nolan', 'Friesen', NULL, NULL, 'f', '1984-01-08', 'married', NULL, NULL, '9225 Kunze Street Suite 099\nWest Thora, NY 68705-3887', '5124 Lueilwitz Ville Apt. 812\nNorth Katherine, NM 77131', NULL, '09283761350'),
(43, 'Kaela', 'Gutmann', 'Considine', NULL, NULL, 'f', '1979-10-30', 'single', NULL, NULL, '9701 Jewell Fork Suite 307\nPort Darrionstad, WI 41759', '2489 Favian Freeway\nNorth Lyric, PA 73255-9409', NULL, '09953743007'),
(44, 'Bud', 'Schmidt', 'Bahringer', NULL, NULL, 'm', '1981-05-18', 'single', NULL, NULL, '8694 Wiza Dam\nFeltonland, IA 34445', '965 Lexie Place\nLake Phyllishaven, MT 27496-1257', NULL, '09397357740'),
(45, 'Lora', 'Ziemann', 'Kohler', NULL, NULL, 'f', '1984-03-11', 'single', NULL, NULL, '45100 Isac Meadows Suite 220\nSouth Khalilton, WA 15619-7232', '3177 Swaniawski Pine Apt. 489\nDaynemouth, IA 66567-7864', NULL, '09509256433'),
(46, 'Earline', 'Heathcote', 'Bernier', NULL, NULL, 'f', '1981-01-06', 'married', NULL, NULL, '6529 Sim Plaza Suite 654\nLake Anastacioton, MN 53187-2455', '931 Anna Rue Suite 072\nMilesbury, SD 55306', NULL, '09170452419'),
(47, 'Merle', 'Williamson', 'Wisozk', NULL, NULL, 'm', '1991-08-10', 'single', NULL, NULL, '32807 Adelia Flats\nDevantechester, CT 17741', '939 Jast Crest Apt. 892\nAlyshaberg, ME 90106', NULL, '09692168034'),
(48, 'Jonathon', 'Fritsch', 'Abshire', NULL, NULL, 'm', '1995-03-04', 'single', NULL, NULL, '70372 Hamill Field\nThomasmouth, MT 80655-4104', '7277 Burnice Freeway\nRoweburgh, MT 42296-7175', NULL, '09838574660'),
(49, 'Rachel', 'Frami', 'Effertz', NULL, NULL, 'f', '1991-05-12', 'single', NULL, NULL, '285 Bud Locks\nEulaliaport, NM 58148-5533', '7506 Dooley Via Apt. 903\nArmstrongbury, OK 18748-4367', NULL, '09171745984');

-- --------------------------------------------------------

--
-- Table structure for table `program`
--

CREATE TABLE `program` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `color_code` varchar(255) DEFAULT NULL,
  `is_deleted` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `program`
--

INSERT INTO `program` (`id`, `name`, `description`, `logo`, `color_code`, `is_deleted`, `created_at`) VALUES
(1, 'BSIT', 'Bachelor of Science in Information Technology', NULL, NULL, 0, '2026-09-02 18:56:02'),
(2, 'BLIS', 'Bachelor of Library and Information Science', NULL, NULL, 0, '2026-09-02 18:56:02'),
(3, 'BEEd', 'Bachelor of Elementary Education', NULL, NULL, 0, '2026-09-02 18:56:02'),
(4, 'BSN', 'Bachelor of Science in Nursing', NULL, NULL, 0, '2026-09-02 18:56:02'),
(5, 'BSHM', 'Bachelor of Science in Hospitality Management', NULL, NULL, 0, '2026-09-02 18:56:02'),
(6, 'BSBA', 'Bachelor of Science in Business Administration', NULL, NULL, 0, '2026-09-02 18:56:02'),
(7, 'BSTM', 'Bachelor of Science in Tourism Management', NULL, NULL, 0, '2026-09-02 18:56:02');

-- --------------------------------------------------------

--
-- Table structure for table `push_subscriptions`
--

CREATE TABLE `push_subscriptions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `subscribable_type` varchar(255) NOT NULL,
  `subscribable_id` bigint(20) UNSIGNED NOT NULL,
  `endpoint` varchar(1024) CHARACTER SET ascii COLLATE ascii_general_ci NOT NULL,
  `public_key` varchar(255) DEFAULT NULL,
  `auth_token` varchar(255) DEFAULT NULL,
  `content_encoding` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `referral`
--

CREATE TABLE `referral` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `referral_number` varchar(255) NOT NULL,
  `program_head_id` bigint(20) UNSIGNED NOT NULL,
  `reason_description` longtext NOT NULL,
  `referral_status` enum('pending','rejected','approved') NOT NULL DEFAULT 'pending',
  `rejected_reason` longtext DEFAULT NULL,
  `send_to_guidance` tinyint(4) DEFAULT NULL,
  `rejected_at` datetime DEFAULT NULL,
  `confirmed_at` datetime DEFAULT NULL,
  `archived_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `referral`
--

INSERT INTO `referral` (`id`, `referral_number`, `program_head_id`, `reason_description`, `referral_status`, `rejected_reason`, `send_to_guidance`, `rejected_at`, `confirmed_at`, `archived_at`, `created_at`) VALUES
(1, '08062601', 2, 'Eligendi accusamus nobis voluptatem modi magni. Quis fugit iure adipisci laudantium velit sint.', 'rejected', 'Quis tenetur ratione commodi laboriosam dicta nobis et minus id eius soluta.', 0, '2026-08-07 12:04:41', NULL, '2031-08-07 12:04:41', '2026-08-06 04:04:41'),
(2, '09232501', 2, 'Tempora officiis inventore ut veniam similique. Veritatis nam praesentium dolor quaerat impedit quam. In sit et assumenda.', 'approved', NULL, 1, NULL, '2025-09-26 19:00:58', '2030-09-26 19:00:58', '2025-09-23 11:00:58'),
(3, '08202601', 2, 'Sit et veritatis dolorum qui. Dignissimos nesciunt unde hic asperiores dolorem rerum quod. Iure tempora et adipisci excepturi.', 'approved', NULL, 0, NULL, '2026-08-21 05:57:19', '2031-08-21 05:57:19', '2026-08-19 21:57:19'),
(4, '09012601', 2, 'Qui aliquam iure voluptatem consequatur consequuntur voluptate ut. Sed expedita sed omnis sint sed.', 'approved', NULL, 1, NULL, '2026-09-04 10:36:13', '2031-09-04 10:36:13', '2026-09-01 02:36:13'),
(5, '03232601', 2, 'Quibusdam saepe error modi maiores qui sapiente voluptas aliquam. Eos voluptatem quo et ea iusto in.', 'approved', NULL, 0, NULL, '2026-03-26 15:15:22', '2031-03-26 15:15:22', '2026-03-23 07:15:22'),
(6, '08182601', 2, 'Impedit explicabo est iste dolor. Sint veniam perferendis cumque temporibus. Est recusandae rerum est aut.', 'rejected', 'Quia aperiam quisquam odit asperiores accusamus.', 1, '2026-08-19 00:57:12', NULL, '2031-08-19 00:57:12', '2026-08-17 16:57:12'),
(7, '10062501', 2, 'Voluptas sint nemo sint ipsum et. Deserunt blanditiis saepe omnis praesentium nostrum placeat.', 'approved', NULL, 0, NULL, '2025-10-10 13:19:46', '2030-10-10 13:19:46', '2025-10-06 05:19:46'),
(8, '07252601', 2, 'Consequatur deserunt quos debitis. Sed sit illum quaerat fuga praesentium soluta.', 'approved', NULL, 1, NULL, '2026-07-27 02:40:45', '2031-07-27 02:40:45', '2026-07-24 18:40:45'),
(9, '01272601', 2, 'Sed est consequuntur soluta magnam. Ea autem perspiciatis adipisci esse. Natus laudantium sunt omnis dolores et.', 'approved', NULL, 0, NULL, '2026-01-31 08:59:01', '2031-01-31 08:59:01', '2026-01-27 00:59:01'),
(10, '11132501', 2, 'Delectus nobis vitae et exercitationem et. Consequatur inventore eaque quo esse.', 'approved', NULL, 0, NULL, '2025-11-18 09:01:27', '2030-11-18 09:01:27', '2025-11-13 01:01:27'),
(11, '09222501', 2, 'Dolor eius sed temporibus quis rerum qui. Qui tempore similique in itaque. Ea et aut dignissimos omnis.', 'approved', NULL, 1, NULL, '2025-09-25 13:12:24', '2030-09-25 13:12:24', '2025-09-22 05:12:24'),
(12, '02122601', 2, 'Enim expedita quis quia reprehenderit. Fuga vel maiores numquam similique non doloremque velit ipsam.', 'approved', NULL, 0, NULL, '2026-02-16 06:53:15', '2031-02-16 06:53:15', '2026-02-11 22:53:15'),
(13, '12072501', 2, 'Perspiciatis voluptates est minus unde. Aliquam possimus ea dignissimos enim dicta.', 'pending', NULL, 0, NULL, NULL, NULL, '2025-12-07 06:39:45'),
(14, '06032601', 2, 'Et praesentium dolores odit rerum nulla omnis at pariatur. Illum ut error doloremque consectetur impedit tempore quos accusantium. Officiis tempora ratione nam alias amet possimus.', 'pending', NULL, 1, NULL, NULL, NULL, '2026-06-03 00:32:18'),
(15, '05042601', 2, 'Ut autem consequatur architecto sed ex nostrum. Fugit et et non molestiae officia ullam officia repudiandae. Neque quod sit itaque et voluptate recusandae eligendi aut.', 'approved', NULL, 0, NULL, '2026-05-05 14:59:20', '2031-05-05 14:59:20', '2026-05-04 06:59:20'),
(16, '12282501', 2, 'Voluptas corrupti ullam dolorem. Vel praesentium natus quos ea amet.', 'pending', NULL, 1, NULL, NULL, NULL, '2025-12-28 05:45:04'),
(17, '06092601', 2, 'Velit ut iste assumenda accusantium qui. Corrupti autem eos neque et. Cumque amet necessitatibus temporibus quae iusto.', 'approved', NULL, 0, NULL, '2026-06-13 03:47:34', '2031-06-13 03:47:34', '2026-06-08 19:47:34'),
(18, '10262501', 2, 'Excepturi doloribus fugiat at ut. Deleniti cum vel reprehenderit quo ratione adipisci vero non. Iusto voluptatem molestias eaque nihil recusandae nisi a.', 'approved', NULL, 0, NULL, '2025-10-31 01:17:32', '2030-10-31 01:17:32', '2025-10-25 17:17:32'),
(19, '04262601', 2, 'Ab voluptas reprehenderit est hic quasi minus. Ea dolorum et aliquid dolore iure et dicta.', 'approved', NULL, 1, NULL, '2026-04-28 22:22:34', '2031-04-28 22:22:34', '2026-04-26 14:22:34'),
(20, '05092601', 2, 'Incidunt soluta dolor asperiores impedit numquam aut. Quod eveniet atque voluptatem amet.', 'approved', NULL, 0, NULL, '2026-05-11 09:41:11', '2031-05-11 09:41:11', '2026-05-09 01:41:11');

-- --------------------------------------------------------

--
-- Table structure for table `referral_referred_student`
--

CREATE TABLE `referral_referred_student` (
  `referral_id` bigint(20) UNSIGNED NOT NULL,
  `student_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `referral_referred_student`
--

INSERT INTO `referral_referred_student` (`referral_id`, `student_id`) VALUES
(1, 11),
(1, 31),
(2, 30),
(3, 15),
(4, 14),
(4, 20),
(5, 19),
(6, 31),
(7, 27),
(7, 31),
(8, 25),
(8, 13),
(9, 32),
(10, 19),
(10, 10),
(11, 30),
(12, 6),
(13, 22),
(14, 30),
(15, 7),
(15, 20),
(16, 18),
(17, 22),
(17, 5),
(18, 8),
(18, 31),
(19, 10),
(19, 8),
(20, 3),
(20, 9);

-- --------------------------------------------------------

--
-- Table structure for table `report`
--

CREATE TABLE `report` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `report_number` varchar(255) NOT NULL,
  `report_name` varchar(255) NOT NULL,
  `report_type` varchar(255) NOT NULL,
  `file_type` varchar(255) NOT NULL,
  `filters` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`filters`)),
  `filters_hash` varchar(32) DEFAULT NULL,
  `file_name` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('eKcPn1qeqc5Xh9QmbUKrfrJoDJCeFhVmgcRbFZJ6', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJHZEpuTGZnYXFPZXE4QVVkb3lvNmFKM0J3ekRBTHVySkh4QUF5VEQzIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9zdXBlci1hZG1pblwvbG9naW5cL3Bhc3N3b3JkIiwicm91dGUiOiJzdXBlci1hZG1pbi5tYWludGVuYW5jZS1sb2dpbiJ9LCJfZmxhc2giOnsib2xkIjpbXSwibmV3IjpbXX19', 1788506053),
('iywwusy04YLYT4m39oYSMtj3B1BOFLpmc8ZhaOw8', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJOcm55bk5uNk5kWGRqOEdDeU41WnVMTjQwclZXaHhhVFpORGRjTzFYIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL2xvY2FsaG9zdDo4MDAwIiwicm91dGUiOiJ0eXBlLnVzZXIifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1788500075),
('L7vg4rc5FjFasrYBAszDhkTYMkEiYgxoJPOc2oi0', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJTWXphbTFlZGZyN0NocndRQjkxQXlMY05tS3RWZXhwUEdOblhWbjhwIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cL2xvY2FsaG9zdDo4MDAwXC9tYWludGVuYW5jZVwvcHJldmlldyIsInJvdXRlIjpudWxsfSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119LCJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI6MX0=', 1788506213),
('RBrBSPeWhICsNOxGLvE4uZuHdt2YoJRk26WCgl5w', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiI0SldXNnV5c0ZQbWFRTkRkYnc3SzV0cWthMTlXaUsxYW9UTGp0OWJvIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwIiwicm91dGUiOiJ0eXBlLnVzZXIifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1788500005);

-- --------------------------------------------------------

--
-- Table structure for table `teaching_staff`
--

CREATE TABLE `teaching_staff` (
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `program_id` bigint(20) UNSIGNED DEFAULT NULL,
  `position` enum('faculty','program_head') NOT NULL DEFAULT 'faculty'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `teaching_staff`
--

INSERT INTO `teaching_staff` (`user_id`, `program_id`, `position`) VALUES
(33, 1, 'program_head'),
(34, 2, 'program_head'),
(35, 3, 'program_head'),
(36, 4, 'program_head'),
(37, 5, 'program_head'),
(38, 6, 'program_head'),
(39, 7, 'program_head'),
(40, 2, 'faculty'),
(41, 1, 'faculty'),
(42, 5, 'faculty'),
(43, 5, 'faculty'),
(44, 5, 'faculty'),
(45, 1, 'faculty'),
(46, 2, 'faculty'),
(47, 7, 'faculty'),
(48, 7, 'faculty'),
(49, 1, 'faculty');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `id_number` varchar(20) DEFAULT NULL,
  `role` enum('super_admin','sub_admin','student','teaching_staff','non_teaching_staff','parent','guard','guidance') NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `already_update_profile` tinyint(1) NOT NULL DEFAULT 0,
  `already_update_password` tinyint(1) NOT NULL DEFAULT 0,
  `password` text DEFAULT NULL,
  `activate` tinyint(1) NOT NULL DEFAULT 0,
  `last_seen` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `id_number`, `role`, `username`, `email`, `email_verified_at`, `already_update_profile`, `already_update_password`, `password`, `activate`, `last_seen`, `created_at`) VALUES
(1, 'SA-0001', 'super_admin', 'superadmin', 'superadmin@example.com', '2026-09-02 18:56:01', 0, 1, '$2y$12$Cm05uhMWWAfxBgygygUYauYtuwftO2ArvmHasyySa0t4k/PgL30rS', 1, '2026-09-04 15:16:53', '2026-09-02 18:56:02'),
(2, 'SB-0001', 'sub_admin', 'subadmin', 'subadmin@example.com', '2026-09-02 18:56:02', 0, 1, '$2y$12$wsm.s7qgPvIdELURJwJb9eBdcl2rai0wDsKhtFyY/nvHQ19AX4796', 1, '2026-09-04 00:06:47', '2026-09-02 18:56:02'),
(3, '2025-00001', 'student', 'pwolf', 'qcrona@example.net', '2026-09-02 18:56:05', 0, 1, '$2y$12$WL4EzKAlG.QU2MkFrdTTqeRBo2PcStylYmuUvFf4Af9gx1pXFF86W', 1, NULL, '2026-09-02 18:56:05'),
(4, '2025-00002', 'student', 'hermiston.rhett', 'gbeatty@example.net', '2026-09-02 18:56:05', 0, 1, '$2y$12$WL4EzKAlG.QU2MkFrdTTqeRBo2PcStylYmuUvFf4Af9gx1pXFF86W', 1, NULL, '2026-09-02 18:56:05'),
(5, '2025-00003', 'student', 'huels.norberto', 'vkirlin@example.com', '2026-09-02 18:56:05', 0, 1, '$2y$12$WL4EzKAlG.QU2MkFrdTTqeRBo2PcStylYmuUvFf4Af9gx1pXFF86W', 1, NULL, '2026-09-02 18:56:05'),
(6, '2025-00004', 'student', 'lfriesen', 'schroeder.ashton@example.net', '2026-09-02 18:56:05', 0, 1, '$2y$12$WL4EzKAlG.QU2MkFrdTTqeRBo2PcStylYmuUvFf4Af9gx1pXFF86W', 1, NULL, '2026-09-02 18:56:05'),
(7, '2025-00005', 'student', 'maudie57', 'tbrakus@example.org', '2026-09-02 18:56:05', 0, 1, '$2y$12$WL4EzKAlG.QU2MkFrdTTqeRBo2PcStylYmuUvFf4Af9gx1pXFF86W', 1, NULL, '2026-09-02 18:56:05'),
(8, '2025-00006', 'student', 'elta.gleichner', 'werner.hodkiewicz@example.org', '2026-09-02 18:56:05', 0, 1, '$2y$12$WL4EzKAlG.QU2MkFrdTTqeRBo2PcStylYmuUvFf4Af9gx1pXFF86W', 1, NULL, '2026-09-02 18:56:05'),
(9, '2025-00007', 'student', 'dina.hodkiewicz', 'ondricka.dustin@example.net', '2026-09-02 18:56:05', 0, 1, '$2y$12$WL4EzKAlG.QU2MkFrdTTqeRBo2PcStylYmuUvFf4Af9gx1pXFF86W', 1, NULL, '2026-09-02 18:56:05'),
(10, '2025-00008', 'student', 'richie97', 'maximus09@example.net', '2026-09-02 18:56:05', 0, 1, '$2y$12$WL4EzKAlG.QU2MkFrdTTqeRBo2PcStylYmuUvFf4Af9gx1pXFF86W', 1, NULL, '2026-09-02 18:56:05'),
(11, '2025-00009', 'student', 'aiyana.ziemann', 'skilback@example.com', '2026-09-02 18:56:05', 0, 1, '$2y$12$WL4EzKAlG.QU2MkFrdTTqeRBo2PcStylYmuUvFf4Af9gx1pXFF86W', 1, NULL, '2026-09-02 18:56:05'),
(12, '2025-00010', 'student', 'alexzander.schaden', 'daisy.schaden@example.org', '2026-09-02 18:56:06', 0, 1, '$2y$12$WL4EzKAlG.QU2MkFrdTTqeRBo2PcStylYmuUvFf4Af9gx1pXFF86W', 1, NULL, '2026-09-02 18:56:06'),
(13, '2025-00011', 'student', 'jarret71', 'rau.jarvis@example.net', '2026-09-02 18:56:06', 0, 1, '$2y$12$WL4EzKAlG.QU2MkFrdTTqeRBo2PcStylYmuUvFf4Af9gx1pXFF86W', 1, NULL, '2026-09-02 18:56:06'),
(14, '2025-00012', 'student', 'zackary56', 'farrell.aglae@example.com', '2026-09-02 18:56:06', 0, 1, '$2y$12$WL4EzKAlG.QU2MkFrdTTqeRBo2PcStylYmuUvFf4Af9gx1pXFF86W', 1, NULL, '2026-09-02 18:56:06'),
(15, '2025-00013', 'student', 'carmen85', 'randal23@example.com', '2026-09-02 18:56:06', 0, 1, '$2y$12$WL4EzKAlG.QU2MkFrdTTqeRBo2PcStylYmuUvFf4Af9gx1pXFF86W', 1, NULL, '2026-09-02 18:56:06'),
(16, '2025-00014', 'student', 'hane.alisa', 'mrobel@example.net', '2026-09-02 18:56:06', 0, 1, '$2y$12$WL4EzKAlG.QU2MkFrdTTqeRBo2PcStylYmuUvFf4Af9gx1pXFF86W', 1, NULL, '2026-09-02 18:56:06'),
(17, '2025-00015', 'student', 'daphney13', 'dbrakus@example.org', '2026-09-02 18:56:06', 0, 1, '$2y$12$WL4EzKAlG.QU2MkFrdTTqeRBo2PcStylYmuUvFf4Af9gx1pXFF86W', 1, NULL, '2026-09-02 18:56:06'),
(18, '2025-00016', 'student', 'oleta.fritsch', 'vgrant@example.com', '2026-09-02 18:56:06', 0, 1, '$2y$12$WL4EzKAlG.QU2MkFrdTTqeRBo2PcStylYmuUvFf4Af9gx1pXFF86W', 1, NULL, '2026-09-02 18:56:06'),
(19, '2025-00017', 'student', 'misty.cassin', 'sidney33@example.net', '2026-09-02 18:56:06', 0, 1, '$2y$12$WL4EzKAlG.QU2MkFrdTTqeRBo2PcStylYmuUvFf4Af9gx1pXFF86W', 1, NULL, '2026-09-02 18:56:06'),
(20, '2025-00018', 'student', 'wschinner', 'ehermann@example.com', '2026-09-02 18:56:06', 0, 1, '$2y$12$WL4EzKAlG.QU2MkFrdTTqeRBo2PcStylYmuUvFf4Af9gx1pXFF86W', 1, NULL, '2026-09-02 18:56:06'),
(21, '2025-00019', 'student', 'eula75', 'laurel45@example.org', '2026-09-02 18:56:06', 0, 1, '$2y$12$WL4EzKAlG.QU2MkFrdTTqeRBo2PcStylYmuUvFf4Af9gx1pXFF86W', 1, NULL, '2026-09-02 18:56:06'),
(22, '2025-00020', 'student', 'kbatz', 'toy.taurean@example.net', '2026-09-02 18:56:06', 0, 1, '$2y$12$WL4EzKAlG.QU2MkFrdTTqeRBo2PcStylYmuUvFf4Af9gx1pXFF86W', 1, NULL, '2026-09-02 18:56:06'),
(23, '2025-00021', 'student', 'kreiger.gregg', 'mariana52@example.net', '2026-09-02 18:56:06', 0, 1, '$2y$12$WL4EzKAlG.QU2MkFrdTTqeRBo2PcStylYmuUvFf4Af9gx1pXFF86W', 1, NULL, '2026-09-02 18:56:06'),
(24, '2025-00022', 'student', 'ooreilly', 'zledner@example.net', '2026-09-02 18:56:06', 0, 1, '$2y$12$WL4EzKAlG.QU2MkFrdTTqeRBo2PcStylYmuUvFf4Af9gx1pXFF86W', 1, NULL, '2026-09-02 18:56:06'),
(25, '2025-00023', 'student', 'writchie', 'lamar15@example.org', '2026-09-02 18:56:06', 0, 1, '$2y$12$WL4EzKAlG.QU2MkFrdTTqeRBo2PcStylYmuUvFf4Af9gx1pXFF86W', 1, NULL, '2026-09-02 18:56:06'),
(26, '2025-00024', 'student', 'helga.schamberger', 'terrance.schmidt@example.org', '2026-09-02 18:56:06', 0, 1, '$2y$12$WL4EzKAlG.QU2MkFrdTTqeRBo2PcStylYmuUvFf4Af9gx1pXFF86W', 1, NULL, '2026-09-02 18:56:06'),
(27, '2025-00025', 'student', 'alda.bergstrom', 'szboncak@example.net', '2026-09-02 18:56:07', 0, 1, '$2y$12$WL4EzKAlG.QU2MkFrdTTqeRBo2PcStylYmuUvFf4Af9gx1pXFF86W', 1, NULL, '2026-09-02 18:56:07'),
(28, '2025-00026', 'student', 'wyundt', 'renner.alize@example.org', '2026-09-02 18:56:07', 0, 1, '$2y$12$WL4EzKAlG.QU2MkFrdTTqeRBo2PcStylYmuUvFf4Af9gx1pXFF86W', 1, NULL, '2026-09-02 18:56:07'),
(29, '2025-00027', 'student', 'shuel', 'anastacio69@example.net', '2026-09-02 18:56:07', 0, 1, '$2y$12$WL4EzKAlG.QU2MkFrdTTqeRBo2PcStylYmuUvFf4Af9gx1pXFF86W', 1, NULL, '2026-09-02 18:56:07'),
(30, '2025-00028', 'student', 'sonny.schowalter', 'zeffertz@example.com', '2026-09-02 18:56:07', 0, 1, '$2y$12$WL4EzKAlG.QU2MkFrdTTqeRBo2PcStylYmuUvFf4Af9gx1pXFF86W', 1, NULL, '2026-09-02 18:56:07'),
(31, '2025-00029', 'student', 'daisha.grant', 'brett41@example.org', '2026-09-02 18:56:07', 0, 1, '$2y$12$WL4EzKAlG.QU2MkFrdTTqeRBo2PcStylYmuUvFf4Af9gx1pXFF86W', 1, NULL, '2026-09-02 18:56:07'),
(32, '2025-00030', 'student', 'everette.okeefe', 'raynor.carmine@example.net', '2026-09-02 18:56:07', 0, 1, '$2y$12$WL4EzKAlG.QU2MkFrdTTqeRBo2PcStylYmuUvFf4Af9gx1pXFF86W', 1, NULL, '2026-09-02 18:56:07'),
(33, 'TS-0001', 'teaching_staff', 'bertram22', 'maverick.cassin@example.org', '2026-09-02 18:56:07', 0, 1, '$2y$12$WL4EzKAlG.QU2MkFrdTTqeRBo2PcStylYmuUvFf4Af9gx1pXFF86W', 1, NULL, '2026-09-02 18:56:07'),
(34, 'TS-0002', 'teaching_staff', 'srenner', 'gibson.nyasia@example.com', '2026-09-02 18:56:07', 0, 1, '$2y$12$WL4EzKAlG.QU2MkFrdTTqeRBo2PcStylYmuUvFf4Af9gx1pXFF86W', 1, NULL, '2026-09-02 18:56:07'),
(35, 'TS-0003', 'teaching_staff', 'heidenreich.mavis', 'cwisozk@example.net', '2026-09-02 18:56:07', 0, 1, '$2y$12$WL4EzKAlG.QU2MkFrdTTqeRBo2PcStylYmuUvFf4Af9gx1pXFF86W', 1, NULL, '2026-09-02 18:56:07'),
(36, 'TS-0004', 'teaching_staff', 'carter.mozelle', 'malcolm.blick@example.org', '2026-09-02 18:56:07', 0, 1, '$2y$12$WL4EzKAlG.QU2MkFrdTTqeRBo2PcStylYmuUvFf4Af9gx1pXFF86W', 1, NULL, '2026-09-02 18:56:07'),
(37, 'TS-0005', 'teaching_staff', 'fhowell', 'oschneider@example.org', '2026-09-02 18:56:07', 0, 1, '$2y$12$WL4EzKAlG.QU2MkFrdTTqeRBo2PcStylYmuUvFf4Af9gx1pXFF86W', 1, NULL, '2026-09-02 18:56:07'),
(38, 'TS-0006', 'teaching_staff', 'uhomenick', 'hermann.roscoe@example.org', '2026-09-02 18:56:07', 0, 1, '$2y$12$WL4EzKAlG.QU2MkFrdTTqeRBo2PcStylYmuUvFf4Af9gx1pXFF86W', 1, NULL, '2026-09-02 18:56:07'),
(39, 'TS-0007', 'teaching_staff', 'kohler.mayra', 'alford25@example.com', '2026-09-02 18:56:07', 0, 1, '$2y$12$WL4EzKAlG.QU2MkFrdTTqeRBo2PcStylYmuUvFf4Af9gx1pXFF86W', 1, NULL, '2026-09-02 18:56:07'),
(40, 'TS-0008', 'teaching_staff', 'bruen.isadore', 'tom08@example.org', '2026-09-02 18:56:07', 0, 1, '$2y$12$WL4EzKAlG.QU2MkFrdTTqeRBo2PcStylYmuUvFf4Af9gx1pXFF86W', 1, NULL, '2026-09-02 18:56:07'),
(41, 'TS-0009', 'teaching_staff', 'brodriguez', 'janice.mayert@example.com', '2026-09-02 18:56:07', 0, 1, '$2y$12$WL4EzKAlG.QU2MkFrdTTqeRBo2PcStylYmuUvFf4Af9gx1pXFF86W', 1, NULL, '2026-09-02 18:56:07'),
(42, 'TS-0010', 'teaching_staff', 'kuhic.erna', 'nstokes@example.com', '2026-09-02 18:56:07', 0, 1, '$2y$12$WL4EzKAlG.QU2MkFrdTTqeRBo2PcStylYmuUvFf4Af9gx1pXFF86W', 1, NULL, '2026-09-02 18:56:07'),
(43, 'TS-0011', 'teaching_staff', 'joanie.block', 'prunolfsson@example.org', '2026-09-02 18:56:07', 0, 1, '$2y$12$WL4EzKAlG.QU2MkFrdTTqeRBo2PcStylYmuUvFf4Af9gx1pXFF86W', 1, NULL, '2026-09-02 18:56:07'),
(44, 'TS-0012', 'teaching_staff', 'effertz.zoey', 'pmetz@example.org', '2026-09-02 18:56:07', 0, 1, '$2y$12$WL4EzKAlG.QU2MkFrdTTqeRBo2PcStylYmuUvFf4Af9gx1pXFF86W', 1, NULL, '2026-09-02 18:56:07'),
(45, 'TS-0013', 'teaching_staff', 'khalil58', 'ava.frami@example.net', '2026-09-02 18:56:07', 0, 1, '$2y$12$WL4EzKAlG.QU2MkFrdTTqeRBo2PcStylYmuUvFf4Af9gx1pXFF86W', 1, NULL, '2026-09-02 18:56:07'),
(46, 'TS-0014', 'teaching_staff', 'devante.mosciski', 'hahn.sabrina@example.com', '2026-09-02 18:56:07', 0, 1, '$2y$12$WL4EzKAlG.QU2MkFrdTTqeRBo2PcStylYmuUvFf4Af9gx1pXFF86W', 1, NULL, '2026-09-02 18:56:07'),
(47, 'TS-0015', 'teaching_staff', 'cormier.birdie', 'otto.goldner@example.net', '2026-09-02 18:56:07', 0, 1, '$2y$12$WL4EzKAlG.QU2MkFrdTTqeRBo2PcStylYmuUvFf4Af9gx1pXFF86W', 1, NULL, '2026-09-02 18:56:07'),
(48, 'TS-0016', 'teaching_staff', 'cwitting', 'jacques61@example.net', '2026-09-02 18:56:07', 0, 1, '$2y$12$WL4EzKAlG.QU2MkFrdTTqeRBo2PcStylYmuUvFf4Af9gx1pXFF86W', 1, NULL, '2026-09-02 18:56:07'),
(49, 'TS-0017', 'teaching_staff', 'mohr.loma', 'jazmyne07@example.org', '2026-09-02 18:56:07', 0, 1, '$2y$12$WL4EzKAlG.QU2MkFrdTTqeRBo2PcStylYmuUvFf4Af9gx1pXFF86W', 1, NULL, '2026-09-02 18:56:07');

-- --------------------------------------------------------

--
-- Table structure for table `user_permissions`
--

CREATE TABLE `user_permissions` (
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `allow_complaint` tinyint(1) DEFAULT NULL,
  `allow_referral` tinyint(1) DEFAULT NULL,
  `allow_absent_form` tinyint(1) DEFAULT NULL,
  `allow_appointment` tinyint(1) DEFAULT NULL,
  `allow_gatepass` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_permissions`
--

INSERT INTO `user_permissions` (`user_id`, `allow_complaint`, `allow_referral`, `allow_absent_form`, `allow_appointment`, `allow_gatepass`) VALUES
(3, 1, 1, 1, 1, 1),
(4, 1, 1, 1, 1, 1),
(5, 1, 1, 1, 1, 1),
(6, 1, 1, 1, 1, 1),
(7, 1, 1, 1, 1, 1),
(8, 1, 1, 1, 1, 1),
(9, 1, 1, 1, 1, 1),
(10, 1, 1, 1, 1, 1),
(11, 1, 1, 1, 1, 1),
(12, 1, 1, 1, 1, 1),
(13, 1, 1, 1, 1, 1),
(14, 1, 1, 1, 1, 1),
(15, 1, 1, 1, 1, 1),
(16, 1, 1, 1, 1, 1),
(17, 1, 1, 1, 1, 1),
(18, 1, 1, 1, 1, 1),
(19, 1, 1, 1, 1, 1),
(20, 1, 1, 1, 1, 1),
(21, 1, 1, 1, 1, 1),
(22, 1, 1, 1, 1, 1),
(23, 1, 1, 1, 1, 1),
(24, 1, 1, 1, 1, 1),
(25, 1, 1, 1, 1, 1),
(26, 1, 1, 1, 1, 1),
(27, 1, 1, 1, 1, 1),
(28, 1, 1, 1, 1, 1),
(29, 1, 1, 1, 1, 1),
(30, 1, 1, 1, 1, 1),
(31, 1, 1, 1, 1, 1),
(32, 1, 1, 1, 1, 1),
(33, 1, 1, 1, 1, 1),
(34, 1, 1, 1, 1, 1),
(35, 1, 1, 1, 1, 1),
(36, 1, 1, 1, 1, 1),
(37, 1, 1, 1, 1, 1),
(38, 1, 1, 1, 1, 1),
(39, 1, 1, 1, 1, 1),
(40, 1, 1, 1, 1, 1),
(41, 1, 1, 1, 1, 1),
(42, 1, 1, 1, 1, 1),
(43, 1, 1, 1, 1, 1),
(44, 1, 1, 1, 1, 1),
(45, 1, 1, 1, 1, 1),
(46, 1, 1, 1, 1, 1),
(47, 1, 1, 1, 1, 1),
(48, 1, 1, 1, 1, 1),
(49, 1, 1, 1, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `violation`
--

CREATE TABLE `violation` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `violation_name` varchar(255) NOT NULL,
  `offense_status` tinyint(1) NOT NULL,
  `is_deleted` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `violation`
--

INSERT INTO `violation` (`id`, `violation_name`, `offense_status`, `is_deleted`, `created_at`) VALUES
(1, 'Did not wear the correct school uniform', 0, 0, '2026-09-03 02:56:02'),
(2, 'Used a mobile phone during class', 0, 0, '2026-09-03 02:56:02'),
(3, 'Skipped class without valid reason', 0, 0, '2026-09-03 02:56:02'),
(4, 'Left school premises without a gate pass', 0, 0, '2026-09-03 02:56:02'),
(5, 'Entered faculty room without permission', 0, 0, '2026-09-03 02:56:02'),
(6, 'Disrespected a teacher in class', 0, 0, '2026-09-03 02:56:02'),
(7, 'Littering within school premises', 0, 0, '2026-09-03 02:56:02'),
(8, 'Public display of affection', 0, 0, '2026-09-03 02:56:02'),
(9, 'Loitering during class hours', 0, 0, '2026-09-03 02:56:02'),
(10, 'Improper use of school ID', 0, 0, '2026-09-03 02:56:02'),
(11, 'Engaged in a physical altercation with a classmate', 1, 0, '2026-09-03 02:56:02'),
(12, 'Brought alcohol to campus', 1, 0, '2026-09-03 02:56:02'),
(13, 'Brought a bladed weapon to school', 1, 0, '2026-09-03 02:56:02'),
(14, 'Falsified an excuse letter or school document', 1, 0, '2026-09-03 02:56:02'),
(15, 'Cheating during an examination', 1, 0, '2026-09-03 02:56:02'),
(16, 'Bullying or harassment of another student', 1, 0, '2026-09-03 02:56:02'),
(17, 'Vandalism of school property', 1, 0, '2026-09-03 02:56:02'),
(18, 'Possession of prohibited substances', 1, 0, '2026-09-03 02:56:02'),
(19, 'Theft of school or personal property', 1, 0, '2026-09-03 02:56:02'),
(20, 'Posted offensive content about a teacher or student online', 1, 0, '2026-09-03 02:56:02');

-- --------------------------------------------------------

--
-- Table structure for table `violation_penalty`
--

CREATE TABLE `violation_penalty` (
  `violation_id` bigint(20) UNSIGNED NOT NULL,
  `occurrence` int(11) NOT NULL,
  `penalty_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `violation_penalty`
--

INSERT INTO `violation_penalty` (`violation_id`, `occurrence`, `penalty_id`) VALUES
(1, 1, 1),
(1, 2, 2),
(1, 3, 2),
(1, 3, 3),
(1, 4, 3),
(1, 4, 4),
(1, 5, 4),
(1, 5, 5),
(1, 6, 5),
(1, 6, 6),
(2, 1, 1),
(2, 2, 2),
(2, 3, 2),
(2, 3, 3),
(2, 4, 3),
(2, 4, 4),
(2, 5, 4),
(2, 5, 5),
(2, 6, 5),
(2, 6, 6),
(3, 1, 1),
(3, 2, 2),
(3, 3, 2),
(3, 3, 3),
(3, 4, 3),
(3, 4, 4),
(3, 5, 4),
(3, 5, 5),
(3, 6, 5),
(3, 6, 6),
(4, 1, 1),
(4, 2, 2),
(4, 3, 2),
(4, 3, 3),
(4, 4, 3),
(4, 4, 4),
(4, 5, 4),
(4, 5, 5),
(4, 6, 5),
(4, 6, 6),
(5, 1, 1),
(5, 2, 2),
(5, 3, 2),
(5, 3, 3),
(5, 4, 3),
(5, 4, 4),
(5, 5, 4),
(5, 5, 5),
(5, 6, 5),
(5, 6, 6),
(6, 1, 1),
(6, 2, 2),
(6, 3, 2),
(6, 3, 3),
(6, 4, 3),
(6, 4, 4),
(6, 5, 4),
(6, 5, 5),
(6, 6, 5),
(6, 6, 6),
(7, 1, 1),
(7, 2, 2),
(7, 3, 2),
(7, 3, 3),
(7, 4, 3),
(7, 4, 4),
(7, 5, 4),
(7, 5, 5),
(7, 6, 5),
(7, 6, 6),
(8, 1, 1),
(8, 2, 2),
(8, 3, 2),
(8, 3, 3),
(8, 4, 3),
(8, 4, 4),
(8, 5, 4),
(8, 5, 5),
(8, 6, 5),
(8, 6, 6),
(9, 1, 1),
(9, 2, 2),
(9, 3, 2),
(9, 3, 3),
(9, 4, 3),
(9, 4, 4),
(9, 5, 4),
(9, 5, 5),
(9, 6, 5),
(9, 6, 6),
(10, 1, 1),
(10, 2, 2),
(10, 3, 2),
(10, 3, 3),
(10, 4, 3),
(10, 4, 4),
(10, 5, 4),
(10, 5, 5),
(10, 6, 5),
(10, 6, 6),
(11, 1, 2),
(11, 2, 3),
(11, 3, 3),
(11, 3, 5),
(11, 4, 5),
(11, 4, 6),
(11, 5, 6),
(11, 5, 7),
(11, 6, 7),
(11, 6, 8),
(12, 1, 2),
(12, 2, 3),
(12, 3, 3),
(12, 3, 5),
(12, 4, 5),
(12, 4, 6),
(12, 5, 6),
(12, 5, 7),
(12, 6, 7),
(12, 6, 8),
(13, 1, 2),
(13, 2, 3),
(13, 3, 3),
(13, 3, 5),
(13, 4, 5),
(13, 4, 6),
(13, 5, 6),
(13, 5, 7),
(13, 6, 7),
(13, 6, 8),
(14, 1, 2),
(14, 2, 3),
(14, 3, 3),
(14, 3, 5),
(14, 4, 5),
(14, 4, 6),
(14, 5, 6),
(14, 5, 7),
(14, 6, 7),
(14, 6, 8),
(15, 1, 2),
(15, 2, 3),
(15, 3, 3),
(15, 3, 5),
(15, 4, 5),
(15, 4, 6),
(15, 5, 6),
(15, 5, 7),
(15, 6, 7),
(15, 6, 8),
(16, 1, 2),
(16, 2, 3),
(16, 3, 3),
(16, 3, 5),
(16, 4, 5),
(16, 4, 6),
(16, 5, 6),
(16, 5, 7),
(16, 6, 7),
(16, 6, 8),
(17, 1, 2),
(17, 2, 3),
(17, 3, 3),
(17, 3, 5),
(17, 4, 5),
(17, 4, 6),
(17, 5, 6),
(17, 5, 7),
(17, 6, 7),
(17, 6, 8),
(18, 1, 2),
(18, 2, 3),
(18, 3, 3),
(18, 3, 5),
(18, 4, 5),
(18, 4, 6),
(18, 5, 6),
(18, 5, 7),
(18, 6, 7),
(18, 6, 8),
(19, 1, 2),
(19, 2, 3),
(19, 3, 3),
(19, 3, 5),
(19, 4, 5),
(19, 4, 6),
(19, 5, 6),
(19, 5, 7),
(19, 6, 7),
(19, 6, 8),
(20, 1, 2),
(20, 2, 3),
(20, 3, 3),
(20, 3, 5),
(20, 4, 5),
(20, 4, 6),
(20, 5, 6),
(20, 5, 7),
(20, 6, 7),
(20, 6, 8);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `absent_form`
--
ALTER TABLE `absent_form`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `absent_form_form_number_unique` (`form_number`),
  ADD KEY `absent_form_student_id_foreign` (`student_id`);

--
-- Indexes for table `action_log`
--
ALTER TABLE `action_log`
  ADD PRIMARY KEY (`id`),
  ADD KEY `action_log_user_id_foreign` (`user_id`);

--
-- Indexes for table `appointment`
--
ALTER TABLE `appointment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `appointment_user_id_foreign` (`user_id`);

--
-- Indexes for table `appointment_student`
--
ALTER TABLE `appointment_student`
  ADD KEY `appointment_student_appointment_id_foreign` (`appointment_id`),
  ADD KEY `appointment_student_student_id_foreign` (`student_id`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indexes for table `call_in`
--
ALTER TABLE `call_in`
  ADD PRIMARY KEY (`id`),
  ADD KEY `call_in_student_id_foreign` (`student_id`),
  ADD KEY `call_in_issued_by_foreign` (`issued_by`);

--
-- Indexes for table `complaint`
--
ALTER TABLE `complaint`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `complaint_complaint_number_unique` (`complaint_number`),
  ADD KEY `complaint_complainant_id_foreign` (`complainant_id`),
  ADD KEY `complaint_incident_id_foreign` (`incident_id`);

--
-- Indexes for table `complaint_revision`
--
ALTER TABLE `complaint_revision`
  ADD PRIMARY KEY (`id`),
  ADD KEY `complaint_revision_complaint_id_foreign` (`complaint_id`);

--
-- Indexes for table `complaint_subject`
--
ALTER TABLE `complaint_subject`
  ADD KEY `complaint_subject_complaint_id_foreign` (`complaint_id`),
  ADD KEY `complaint_subject_student_id_foreign` (`student_id`);

--
-- Indexes for table `complaint_subject_violation`
--
ALTER TABLE `complaint_subject_violation`
  ADD KEY `complaint_subject_violation_complaint_id_foreign` (`complaint_id`),
  ADD KEY `complaint_subject_violation_student_id_foreign` (`student_id`),
  ADD KEY `complaint_subject_violation_violation_id_foreign` (`violation_id`);

--
-- Indexes for table `csv_import_row_results`
--
ALTER TABLE `csv_import_row_results`
  ADD PRIMARY KEY (`id`),
  ADD KEY `csv_import_row_results_batch_id_index` (`batch_id`);

--
-- Indexes for table `education_background`
--
ALTER TABLE `education_background`
  ADD PRIMARY KEY (`id`),
  ADD KEY `education_background_student_id_foreign` (`student_id`);

--
-- Indexes for table `enrollment`
--
ALTER TABLE `enrollment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `enrollment_student_id_foreign` (`student_id`),
  ADD KEY `enrollment_program_id_foreign` (`program_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`),
  ADD KEY `failed_jobs_connection_queue_failed_at_index` (`connection`,`queue`,`failed_at`);

--
-- Indexes for table `family`
--
ALTER TABLE `family`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `family_member`
--
ALTER TABLE `family_member`
  ADD KEY `family_member_family_id_foreign` (`family_id`),
  ADD KEY `family_member_member_id_foreign` (`member_id`);

--
-- Indexes for table `gate_pass`
--
ALTER TABLE `gate_pass`
  ADD PRIMARY KEY (`id`),
  ADD KEY `gate_pass_user_id_foreign` (`user_id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notification_sender_id_foreign` (`sender_id`),
  ADD KEY `notification_receiver_id_foreign` (`receiver_id`),
  ADD KEY `notification_notifiable_type_notifiable_id_index` (`notifiable_type`,`notifiable_id`);

--
-- Indexes for table `parent`
--
ALTER TABLE `parent`
  ADD KEY `parent_user_id_foreign` (`user_id`);

--
-- Indexes for table `parent_registration_request`
--
ALTER TABLE `parent_registration_request`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `parent_registration_request_email_unique` (`email`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `penalty`
--
ALTER TABLE `penalty`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `profiles`
--
ALTER TABLE `profiles`
  ADD UNIQUE KEY `profiles_user_id_unique` (`user_id`);

--
-- Indexes for table `program`
--
ALTER TABLE `program`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `push_subscriptions`
--
ALTER TABLE `push_subscriptions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `push_subscriptions_endpoint_unique` (`endpoint`),
  ADD KEY `push_subscriptions_subscribable_morph_idx` (`subscribable_type`,`subscribable_id`);

--
-- Indexes for table `referral`
--
ALTER TABLE `referral`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `referral_referral_number_unique` (`referral_number`),
  ADD KEY `referral_program_head_id_foreign` (`program_head_id`);

--
-- Indexes for table `referral_referred_student`
--
ALTER TABLE `referral_referred_student`
  ADD KEY `referral_referred_student_referral_id_foreign` (`referral_id`),
  ADD KEY `referral_referred_student_student_id_foreign` (`student_id`);

--
-- Indexes for table `report`
--
ALTER TABLE `report`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `report_report_number_unique` (`report_number`),
  ADD KEY `report_user_id_filters_hash_index` (`user_id`,`filters_hash`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `teaching_staff`
--
ALTER TABLE `teaching_staff`
  ADD KEY `teaching_staff_user_id_foreign` (`user_id`),
  ADD KEY `teaching_staff_program_id_foreign` (`program_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_id_number_unique` (`id_number`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Indexes for table `user_permissions`
--
ALTER TABLE `user_permissions`
  ADD UNIQUE KEY `user_permissions_user_id_unique` (`user_id`);

--
-- Indexes for table `violation`
--
ALTER TABLE `violation`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `violation_penalty`
--
ALTER TABLE `violation_penalty`
  ADD KEY `violation_penalty_violation_id_foreign` (`violation_id`),
  ADD KEY `violation_penalty_penalty_id_foreign` (`penalty_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `absent_form`
--
ALTER TABLE `absent_form`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `action_log`
--
ALTER TABLE `action_log`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `appointment`
--
ALTER TABLE `appointment`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `call_in`
--
ALTER TABLE `call_in`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `complaint`
--
ALTER TABLE `complaint`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT for table `complaint_revision`
--
ALTER TABLE `complaint_revision`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `csv_import_row_results`
--
ALTER TABLE `csv_import_row_results`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `education_background`
--
ALTER TABLE `education_background`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT for table `enrollment`
--
ALTER TABLE `enrollment`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `family`
--
ALTER TABLE `family`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `gate_pass`
--
ALTER TABLE `gate_pass`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `notification`
--
ALTER TABLE `notification`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `parent_registration_request`
--
ALTER TABLE `parent_registration_request`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `penalty`
--
ALTER TABLE `penalty`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `program`
--
ALTER TABLE `program`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `push_subscriptions`
--
ALTER TABLE `push_subscriptions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `referral`
--
ALTER TABLE `referral`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `report`
--
ALTER TABLE `report`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `violation`
--
ALTER TABLE `violation`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `absent_form`
--
ALTER TABLE `absent_form`
  ADD CONSTRAINT `absent_form_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `action_log`
--
ALTER TABLE `action_log`
  ADD CONSTRAINT `action_log_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `appointment`
--
ALTER TABLE `appointment`
  ADD CONSTRAINT `appointment_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `appointment_student`
--
ALTER TABLE `appointment_student`
  ADD CONSTRAINT `appointment_student_appointment_id_foreign` FOREIGN KEY (`appointment_id`) REFERENCES `appointment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `appointment_student_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `call_in`
--
ALTER TABLE `call_in`
  ADD CONSTRAINT `call_in_issued_by_foreign` FOREIGN KEY (`issued_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `call_in_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `complaint`
--
ALTER TABLE `complaint`
  ADD CONSTRAINT `complaint_complainant_id_foreign` FOREIGN KEY (`complainant_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `complaint_incident_id_foreign` FOREIGN KEY (`incident_id`) REFERENCES `violation` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `complaint_revision`
--
ALTER TABLE `complaint_revision`
  ADD CONSTRAINT `complaint_revision_complaint_id_foreign` FOREIGN KEY (`complaint_id`) REFERENCES `complaint` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `complaint_subject`
--
ALTER TABLE `complaint_subject`
  ADD CONSTRAINT `complaint_subject_complaint_id_foreign` FOREIGN KEY (`complaint_id`) REFERENCES `complaint` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `complaint_subject_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `complaint_subject_violation`
--
ALTER TABLE `complaint_subject_violation`
  ADD CONSTRAINT `complaint_subject_violation_complaint_id_foreign` FOREIGN KEY (`complaint_id`) REFERENCES `complaint` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `complaint_subject_violation_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `complaint_subject_violation_violation_id_foreign` FOREIGN KEY (`violation_id`) REFERENCES `violation` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `education_background`
--
ALTER TABLE `education_background`
  ADD CONSTRAINT `education_background_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `enrollment`
--
ALTER TABLE `enrollment`
  ADD CONSTRAINT `enrollment_program_id_foreign` FOREIGN KEY (`program_id`) REFERENCES `program` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `enrollment_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `family_member`
--
ALTER TABLE `family_member`
  ADD CONSTRAINT `family_member_family_id_foreign` FOREIGN KEY (`family_id`) REFERENCES `family` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `family_member_member_id_foreign` FOREIGN KEY (`member_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `gate_pass`
--
ALTER TABLE `gate_pass`
  ADD CONSTRAINT `gate_pass_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `notification`
--
ALTER TABLE `notification`
  ADD CONSTRAINT `notification_receiver_id_foreign` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notification_sender_id_foreign` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `parent`
--
ALTER TABLE `parent`
  ADD CONSTRAINT `parent_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `profiles`
--
ALTER TABLE `profiles`
  ADD CONSTRAINT `profiles_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `referral`
--
ALTER TABLE `referral`
  ADD CONSTRAINT `referral_program_head_id_foreign` FOREIGN KEY (`program_head_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `referral_referred_student`
--
ALTER TABLE `referral_referred_student`
  ADD CONSTRAINT `referral_referred_student_referral_id_foreign` FOREIGN KEY (`referral_id`) REFERENCES `referral` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `referral_referred_student_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `report`
--
ALTER TABLE `report`
  ADD CONSTRAINT `report_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `teaching_staff`
--
ALTER TABLE `teaching_staff`
  ADD CONSTRAINT `teaching_staff_program_id_foreign` FOREIGN KEY (`program_id`) REFERENCES `program` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `teaching_staff_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `user_permissions`
--
ALTER TABLE `user_permissions`
  ADD CONSTRAINT `user_permissions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `violation_penalty`
--
ALTER TABLE `violation_penalty`
  ADD CONSTRAINT `violation_penalty_penalty_id_foreign` FOREIGN KEY (`penalty_id`) REFERENCES `penalty` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `violation_penalty_violation_id_foreign` FOREIGN KEY (`violation_id`) REFERENCES `violation` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
