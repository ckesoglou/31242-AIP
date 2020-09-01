CREATE TABLE users (
	username varchar(16) not null,
	display_name varchar(50) not null,
	password_hash char(60) not null,
	PRIMARY KEY (username)
);

CREATE TABLE tokens (
	refresh_token varchar not null,
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

CREATE TABLE images (
	id uniqueidentifier not null,
	blob varbinary(max) not null CONSTRAINT Max_Image_Size CHECK (DATALENGTH(blob) <= 2097152),
	PRIMARY KEY (id)
);

CREATE TABLE requests (
	id uniqueidentifier not null,
	author varchar(16) not null,
	completed_by varchar(16),
	proof_of_completion uniqueidentifier UNIQUE,
	details varchar(50) not null,
	created_time datetime not null,
	completion_time datetime,
	is_completed bit not null default 0,
	FOREIGN KEY (author) REFERENCES users(username),
	FOREIGN KEY (completed_by) REFERENCES users(username),
	FOREIGN KEY (proof_of_completion) REFERENCES images(id),
	PRIMARY KEY (id)
);

CREATE TABLE ious (
	id uniqueidentifier not null,
	item uniqueidentifier not null,
	giver varchar(16) not null,
	receiver varchar(16),
	parent_request uniqueidentifier,
	proof_of_debt uniqueidentifier UNIQUE,
	proof_of_completion uniqueidentifier UNIQUE,
	created_time datetime not null,
	claimed_time datetime,
	is_claimed bit not null default 0,
	FOREIGN KEY (item) REFERENCES items(id),
	FOREIGN KEY (giver) REFERENCES users(username),
	FOREIGN KEY (receiver) REFERENCES users(username),
	FOREIGN KEY (parent_request) REFERENCES requests(id),
	FOREIGN KEY (proof_of_debt) REFERENCES images(id),
	FOREIGN KEY (proof_of_completion) REFERENCES images(id),
	PRIMARY KEY (id)
);