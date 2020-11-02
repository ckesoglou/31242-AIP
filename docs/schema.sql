/*
 * NOTE: This document is for illustrative purposes only
 * The application should create these tables (if missing) automatically without intervention
 */

CREATE TABLE users (
	username varchar(16) not null,
	display_name varchar(50) not null,
	password_hash char(60) not null,
	PRIMARY KEY (username)
);

CREATE TABLE tokens (
	refresh_token uniqueidentifier not null,
	username varchar(16) not null,
	device_name varchar(30) not null,
	created_time datetime not null,
	expiry_time datetime not null,
	FOREIGN KEY (username) REFERENCES users(username),
	PRIMARY KEY (refresh_token)
);

CREATE TABLE items (
	id uniqueidentifier not null,
	display_name varchar(16) not null,
	PRIMARY KEY (id)
);

CREATE TABLE offers (
	id uniqueidentifier not null,
	author varchar(16) not null,
	completed_by varchar(16),
	proof_of_completion varchar(255),
	details varchar(50) not null,
	created_time datetime not null,
	completion_time datetime,
	is_completed bit not null default 0,
	FOREIGN KEY (author) REFERENCES users(username),
	FOREIGN KEY (completed_by) REFERENCES users(username),
	PRIMARY KEY (id)
);

CREATE TABLE ious (
	id uniqueidentifier not null,
	item uniqueidentifier not null,
	giver varchar(16) not null,
	receiver varchar(16),
	parent_offer uniqueidentifier,
	proof_of_debt varchar(255),
	proof_of_completion varchar(255),
	created_time datetime not null,
	claimed_time datetime,
	is_claimed bit not null default 0,
	FOREIGN KEY (item) REFERENCES items(id),
	FOREIGN KEY (giver) REFERENCES users(username),
	FOREIGN KEY (receiver) REFERENCES users(username),
	FOREIGN KEY (parent_offer) REFERENCES offers(id),
	PRIMARY KEY (id)
);

CREATE VIEW leaderboard AS
	SELECT
		users.username,
		COALESCE(SUM(activityLog.points), 0) AS score,
		ROW_NUMBER() OVER(ORDER BY COALESCE(SUM(activityLog.points), 0) DESC) AS rank
	FROM
		users

	left join (
		/* 1 point for any IOU owed to you */
		SELECT
			ious.receiver AS username,
			1 AS points
		FROM
			ious
		UNION

		/* 2 points for any IOU you have repaid */
		SELECT
			ious.giver AS username,
			2 AS points
		FROM
			ious
		WHERE
			ious.is_claimed = 1
		UNION

		/* 1 point for any request (offer) you have published */
		SELECT
			offers.author AS username,
			1 AS points
		FROM
			offers
		UNION

		/* 3 points for any request (offer) you have completed */
		SELECT
			offers.completed_by AS username,
			3 AS points
		FROM
			offers
		WHERE
			offers.is_completed = 1
	) activityLog
		ON users.username = activityLog.username

	GROUP BY
		users.username