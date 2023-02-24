CREATE TABLE `users` (
  `userID` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `role` enum('admin','manager','developer','finance','sales','marketing','user') DEFAULT 'user',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `sessions` (
  `sessionID` int NOT NULL AUTO_INCREMENT,
  `userID` int DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `expiredAt` datetime DEFAULT NULL,
  PRIMARY KEY (`sessionID`),
  KEY `userID` (`userID`),
  CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci