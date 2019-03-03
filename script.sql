create database TastyCloud;
use tastyCloud;

create table if not exists product (
	id int primary key not null auto_increment,
    price int not null default 0
);

create table if not exists translation(
	id int primary key not null auto_increment,
    product_id int not null,
    name varchar(250),
    description text,
    lg varchar(2) not null,
    FOREIGN KEY (product_id) REFERENCES product(id)
);
