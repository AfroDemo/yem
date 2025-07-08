-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 08, 2025 at 08:21 AM
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
-- Database: `yem`
--

-- --------------------------------------------------------

--
-- Table structure for table `conversations`
--

CREATE TABLE `conversations` (
  `id` int(11) NOT NULL,
  `participants` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`participants`)),
  `lastMessage` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`lastMessage`)),
  `unreadCount` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`unreadCount`)),
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `conversations`
--

INSERT INTO `conversations` (`id`, `participants`, `lastMessage`, `unreadCount`, `createdAt`, `updatedAt`) VALUES
(6, '[2,1]', '{\"senderId\":2,\"content\":\"hi\",\"createdAt\":\"2025-07-07T11:36:57.184Z\"}', '{\"1\":0,\"2\":0}', '2025-06-18 01:49:52', '2025-07-07 11:37:08');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `type` enum('workshop','networking','webinar','conference') NOT NULL,
  `startDate` datetime NOT NULL,
  `endDate` datetime NOT NULL,
  `location` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`location`)),
  `host` int(11) NOT NULL,
  `speakers` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`speakers`)),
  `maxAttendees` int(11) DEFAULT NULL,
  `currentAttendees` int(11) DEFAULT 0,
  `registrationLink` varchar(255) DEFAULT NULL,
  `registrationDeadline` datetime DEFAULT NULL,
  `registrationFee` decimal(10,0) DEFAULT NULL,
  `registrationCurrency` varchar(255) DEFAULT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags`)),
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `event_registrations`
--

CREATE TABLE `event_registrations` (
  `eventId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `status` enum('registered','attended','cancelled') NOT NULL DEFAULT 'registered',
  `registrationDate` datetime DEFAULT NULL,
  `feedback` varchar(255) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mentorships`
--

CREATE TABLE `mentorships` (
  `id` int(11) NOT NULL,
  `mentorId` int(11) NOT NULL,
  `menteeId` int(11) NOT NULL,
  `packageType` varchar(255) NOT NULL,
  `status` enum('pending','accepted','rejected','completed') NOT NULL DEFAULT 'pending',
  `goals` text NOT NULL,
  `progress` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`progress`)),
  `background` text NOT NULL,
  `expectations` text NOT NULL,
  `availability` varchar(255) NOT NULL,
  `timezone` varchar(255) NOT NULL,
  `startDate` datetime DEFAULT NULL,
  `endDate` datetime DEFAULT NULL,
  `meetingFrequency` varchar(255) DEFAULT NULL,
  `nextMeetingDate` datetime DEFAULT NULL,
  `feedback` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`feedback`)),
  `notes` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mentorships`
--

INSERT INTO `mentorships` (`id`, `mentorId`, `menteeId`, `packageType`, `status`, `goals`, `progress`, `background`, `expectations`, `availability`, `timezone`, `startDate`, `endDate`, `meetingFrequency`, `nextMeetingDate`, `feedback`, `notes`, `createdAt`, `updatedAt`) VALUES
(1, 1, 2, 'starter', 'completed', '[{\"title\":\"funds\",\"status\":\"in-progress\"}]', '0', 'I am software   developer', 'get funds', 'flexible', '', '2025-05-20 00:11:40', '2025-07-07 15:14:56', '2 sessions/month', NULL, NULL, NULL, '2025-05-20 00:05:59', '2025-07-07 15:14:56');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `senderId` int(11) NOT NULL,
  `receiverId` int(11) NOT NULL,
  `conversationId` int(11) NOT NULL,
  `content` text NOT NULL,
  `read` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`id`, `senderId`, `receiverId`, `conversationId`, `content`, `read`, `createdAt`, `updatedAt`) VALUES
(5, 2, 1, 6, 'Hello  sir, can  i get  additional materials on pitching', 1, '2025-06-18 01:49:52', '2025-06-18 02:03:40'),
(6, 1, 2, 6, 'okay soon', 1, '2025-06-18 02:03:55', '2025-06-18 02:04:11'),
(7, 2, 1, 6, 'thanks, can  we arrange meeting this  weekend', 1, '2025-06-18 02:04:42', '2025-07-07 11:37:08'),
(8, 2, 1, 6, 'and visit my  work place', 1, '2025-06-18 02:05:08', '2025-07-07 11:37:08'),
(9, 2, 1, 6, 'hi', 1, '2025-07-07 11:36:57', '2025-07-07 11:37:08');

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `id` int(11) NOT NULL,
  `mentorId` int(11) NOT NULL,
  `menteeId` int(11) NOT NULL,
  `content` text NOT NULL,
  `status` enum('pending','submitted','reviewed') NOT NULL DEFAULT 'pending',
  `dueDate` datetime NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `resources`
--

CREATE TABLE `resources` (
  `id` int(11) NOT NULL,
  `createdById` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `type` varchar(255) NOT NULL,
  `content` text DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `fileUrl` varchar(255) DEFAULT NULL,
  `tags` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`tags`)),
  `publishDate` datetime NOT NULL DEFAULT current_timestamp(),
  `isDraft` tinyint(1) NOT NULL DEFAULT 0,
  `isFeatured` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `resources`
--

INSERT INTO `resources` (`id`, `createdById`, `title`, `description`, `type`, `content`, `category`, `fileUrl`, `tags`, `publishDate`, `isDraft`, `isFeatured`, `createdAt`, `updatedAt`) VALUES
(4, 1, 'Divine Self Improvement', 'This is  the best self improvement Guide from Shaolin', 'PDF', NULL, 'marketing', '/uploads/resource-1747639992205.pdf', '[\"growth\",\"awareness\",\"awakening\"]', '2025-05-19 07:33:12', 0, 0, '2025-05-19 07:33:12', '2025-05-19 07:33:12');

-- --------------------------------------------------------

--
-- Table structure for table `resourceshares`
--

CREATE TABLE `resourceshares` (
  `resourceId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `mentorId` int(11) NOT NULL,
  `menteeId` int(11) NOT NULL,
  `rating` int(11) NOT NULL,
  `comment` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('20250330044205-create-users.js'),
('20250330120950-create-conversations.js'),
('20250330121657-create-events.js'),
('20250330122413-create-event_registrations.js'),
('20250330123326-create-mentorships.js'),
('20250330123644-create-messages.js'),
('20250330123821-create-resources.js'),
('20250330124238-create-success_stories.js'),
('20250517190918-create-session.js'),
('20250517192459-create-reviews.js'),
('20250517201020-create-reports.js'),
('20250517210251-create-resource-shares.js'),
('20250519223937-create-session-resource.js');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` int(11) NOT NULL,
  `mentorId` int(11) NOT NULL,
  `menteeId` int(11) NOT NULL,
  `startTime` datetime NOT NULL,
  `endTime` datetime NOT NULL,
  `topic` varchar(255) NOT NULL,
  `type` enum('virtual','in-person') NOT NULL,
  `agenda` text DEFAULT NULL,
  `status` enum('upcoming','in-progress','completed','cancelled') NOT NULL DEFAULT 'upcoming',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `mentorId`, `menteeId`, `startTime`, `endTime`, `topic`, `type`, `agenda`, `status`, `createdAt`, `updatedAt`) VALUES
(2, 1, 2, '2025-07-11 07:30:00', '2025-07-11 08:00:00', 'Know your possible investors', 'virtual', 'Get started by  analyzing where  investors are for your  business', 'upcoming', '2025-05-20 00:41:14', '2025-07-07 13:11:01');

-- --------------------------------------------------------

--
-- Table structure for table `session_resources`
--

CREATE TABLE `session_resources` (
  `sessionId` int(11) NOT NULL,
  `resourceId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `session_resources`
--

INSERT INTO `session_resources` (`sessionId`, `resourceId`) VALUES
(2, 4);

-- --------------------------------------------------------

--
-- Table structure for table `success_stories`
--

CREATE TABLE `success_stories` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content` varchar(255) NOT NULL,
  `menteeId` int(11) NOT NULL,
  `mentorId` int(11) NOT NULL,
  `businessName` varchar(255) DEFAULT NULL,
  `businessDescription` varchar(255) DEFAULT NULL,
  `achievements` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`achievements`)),
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`images`)),
  `featured` tinyint(1) NOT NULL DEFAULT 0,
  `approved` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `role` enum('mentee','mentor','admin') NOT NULL,
  `profileImage` varchar(255) DEFAULT NULL,
  `bio` varchar(255) DEFAULT NULL,
  `skills` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`skills`)),
  `interests` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`interests`)),
  `location` varchar(255) DEFAULT NULL,
  `socialLinks` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`socialLinks`)),
  `isVerified` tinyint(1) DEFAULT 0,
  `resetPasswordToken` varchar(255) DEFAULT NULL,
  `resetPasswordExpires` datetime DEFAULT NULL,
  `industries` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`industries`)),
  `businessStage` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`businessStage`)),
  `preferredBusinessStages` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`preferredBusinessStages`)),
  `experienceYears` varchar(255) DEFAULT NULL,
  `availability` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `firstName`, `lastName`, `role`, `profileImage`, `bio`, `skills`, `interests`, `location`, `socialLinks`, `isVerified`, `resetPasswordToken`, `resetPasswordExpires`, `industries`, `businessStage`, `preferredBusinessStages`, `experienceYears`, `availability`, `createdAt`, `updatedAt`) VALUES
(1, 'mentor@adz.com', '$2b$10$5VKJ3RtZ55g1hRcBjl6LbuuH/eJ0azNN086.LEK23yzHQmlfm7B.y', 'john', 'son', 'mentor', '/uploads/profile-1-1750206665014.webp', 'The bestof the best', '[\"Software Development\",\"Project Management\",\"Startups\",\"Mobile App Development\",\"Web Development\",\"E-learning & EdTech\",\"Product Management\",\"Fundraising\",\"Product Development\",\"Financial Planning\"]', '\"\"', 'Mbeya, Tanzania', NULL, 0, NULL, NULL, '[\"Technology\",\"Education\",\"Agriculture\"]', NULL, '[\"Idea\",\"Planning\",\"Development\",\"Testing\"]', '5+ Years', 'flexible', '2025-04-07 16:21:10', '2025-06-18 00:31:05'),
(2, 'user@adz.com', '$2b$10$FhZv.fn9bNNh8IcxzDkGkuWe6R4SET2LIwf8/cmad50QcE4Up90Jq', 'user', 'yem', 'mentee', '/uploads/profile-2-1751903783247.webp', 'Work  hard', '[]', '[\"Fundraising\",\"Funding Opportunities\",\"Software Development\",\"Project Management\"]', 'mbeya,Tanzania', NULL, 0, NULL, NULL, '[\"Technology\",\"Education\"]', '[\"Idea\"]', NULL, '', '', '2025-04-07 16:25:29', '2025-07-07 15:56:23'),
(3, 'admin@adz.com', '$2b$10$YRyRHEHGqNQuU9mEhXWZ3OrH2tSBag01uExbPeNKBHsNUy6EgKGIm', 'admin', 'admin', 'admin', NULL, '', NULL, NULL, '', NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-07-07 16:44:38', '2025-07-07 16:44:38');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `conversations`
--
ALTER TABLE `conversations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `host` (`host`);

--
-- Indexes for table `event_registrations`
--
ALTER TABLE `event_registrations`
  ADD KEY `eventId` (`eventId`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `mentorships`
--
ALTER TABLE `mentorships`
  ADD PRIMARY KEY (`id`),
  ADD KEY `mentorId` (`mentorId`),
  ADD KEY `menteeId` (`menteeId`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `senderId` (`senderId`),
  ADD KEY `receiverId` (`receiverId`),
  ADD KEY `conversationId` (`conversationId`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `mentorId` (`mentorId`),
  ADD KEY `menteeId` (`menteeId`);

--
-- Indexes for table `resources`
--
ALTER TABLE `resources`
  ADD PRIMARY KEY (`id`),
  ADD KEY `createdById` (`createdById`);

--
-- Indexes for table `resourceshares`
--
ALTER TABLE `resourceshares`
  ADD PRIMARY KEY (`resourceId`,`userId`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `mentorId` (`mentorId`),
  ADD KEY `menteeId` (`menteeId`);

--
-- Indexes for table `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `mentorId` (`mentorId`),
  ADD KEY `menteeId` (`menteeId`);

--
-- Indexes for table `session_resources`
--
ALTER TABLE `session_resources`
  ADD PRIMARY KEY (`sessionId`,`resourceId`),
  ADD KEY `resourceId` (`resourceId`);

--
-- Indexes for table `success_stories`
--
ALTER TABLE `success_stories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `menteeId` (`menteeId`),
  ADD KEY `mentorId` (`mentorId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `conversations`
--
ALTER TABLE `conversations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `mentorships`
--
ALTER TABLE `mentorships`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `resources`
--
ALTER TABLE `resources`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sessions`
--
ALTER TABLE `sessions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `success_stories`
--
ALTER TABLE `success_stories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`host`) REFERENCES `users` (`id`);

--
-- Constraints for table `event_registrations`
--
ALTER TABLE `event_registrations`
  ADD CONSTRAINT `event_registrations_ibfk_1` FOREIGN KEY (`eventId`) REFERENCES `events` (`id`),
  ADD CONSTRAINT `event_registrations_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`);

--
-- Constraints for table `mentorships`
--
ALTER TABLE `mentorships`
  ADD CONSTRAINT `mentorships_ibfk_1` FOREIGN KEY (`mentorId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `mentorships_ibfk_2` FOREIGN KEY (`menteeId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `messages_ibfk_3` FOREIGN KEY (`conversationId`) REFERENCES `conversations` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `reports`
--
ALTER TABLE `reports`
  ADD CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`mentorId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reports_ibfk_2` FOREIGN KEY (`menteeId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `resources`
--
ALTER TABLE `resources`
  ADD CONSTRAINT `resources_ibfk_1` FOREIGN KEY (`createdById`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `resourceshares`
--
ALTER TABLE `resourceshares`
  ADD CONSTRAINT `resourceshares_ibfk_1` FOREIGN KEY (`resourceId`) REFERENCES `resources` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `resourceshares_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`mentorId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`menteeId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`mentorId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `sessions_ibfk_2` FOREIGN KEY (`menteeId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `session_resources`
--
ALTER TABLE `session_resources`
  ADD CONSTRAINT `session_resources_ibfk_1` FOREIGN KEY (`sessionId`) REFERENCES `sessions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `session_resources_ibfk_2` FOREIGN KEY (`resourceId`) REFERENCES `resources` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `success_stories`
--
ALTER TABLE `success_stories`
  ADD CONSTRAINT `success_stories_ibfk_1` FOREIGN KEY (`menteeId`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `success_stories_ibfk_2` FOREIGN KEY (`mentorId`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
