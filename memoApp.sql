create database memowall;

create role memowall with password 'memowall' superuser;

Alter role memowall with login;

create table "memo" (
    id serial primary key
,   content varchar(255) not null
,   created_at timestamp default current_timestamp
,   updated_at timestamp
);

create table "user" (
    id serial primary key
,   username varchar(255) not null unique
,   password varchar(255) not null
,   created_at timestamp default current_timestamp
,   updated_at timestamp
);
