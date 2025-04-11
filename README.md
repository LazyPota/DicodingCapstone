# DicodingCapstone


## Installation

1. Clone this repository

2. Install dependencies:
   ```
   go mod tidy
   ```

3. Create MySQL database:
   ```sql
   CREATE DATABASE my_golang_app;
   ```

4. Create user and grant privileges:
   ```sql
   CREATE USER 'golang_user'@'localhost' IDENTIFIED BY 'your_password';
   GRANT ALL PRIVILEGES ON my_golang_app.* TO 'golang_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

5. Create `.env` file in the root folder with the following content:
   ```
   DB_DSN="username:password@tcp(localhost:3306)/urdbname?charset=utf8mb4&parseTime=True&loc=Asia%2FJakarta"
   JWT_SECRET_KEY="URSECREATKEYYASH"
   EMAIL_SENDER=your_email
   EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
   ```
   
   Replace `username`, `password`, and `urdbname` with values that match your database configuration.

## Running the Application

Run the application with the command:
```
go run main.go
```
