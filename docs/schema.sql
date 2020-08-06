CREATE TABLE users (
	username varchar(16) not null,
	display_name varchar(50) not null,
	password_hash char(60) not null,
	is_admin bit not null default 0,
	PRIMARY KEY (username)
);

CREATE TABLE items (
	id uniqueidentifier not null,
	display_name varchar(16) not null,
	is_active bit not null default 1
	PRIMARY KEY (id)
);

CREATE TABLE images (
	id uniqueidentifier not null,
	blob varbinary(max) not null,
	PRIMARY KEY (id)
);

CREATE TABLE favours (
	id uniqueidentifier,
	item uniqueidentifier,
	debtor varchar(16) not null,
	creditor varchar(16),
	proof_of_debt uniqueidentifier,
	proof_of_credit uniqueidentifier,
	created_timestamp timestamp not null,
	claimed_timestamp datetime,
	is_claimed bit not null default 0,
	FOREIGN KEY (item) REFERENCES items(id),
	FOREIGN KEY (debtor) REFERENCES users(username),
	FOREIGN KEY (creditor) REFERENCES users(username),
	FOREIGN KEY (proof_of_debt) REFERENCES images(id),
	FOREIGN KEY (proof_of_credit) REFERENCES images(id),
	PRIMARY KEY (id)
);

CREATE TABLE requests (
	id uniqueidentifier not null,
	details varchar(50) not null,
	author varchar(16) not null,
	created_timestamp timestamp not null,
	claimed_timestamp datetime,
	is_claimed bit not null default 0,
	FOREIGN KEY (author) REFERENCES users(username),
	PRIMARY KEY (id)
);

CREATE TABLE rewards (
	request uniqueidentifier not null,
	favour uniqueidentifier not null,
	FOREIGN KEY (request) REFERENCES requests(id),
	FOREIGN KEY (favour) REFERENCES favours(id),
);