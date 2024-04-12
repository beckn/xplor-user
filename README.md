# User-Service Microservice

This microservice is built using NestJS and Docker. It provides functionality for managing users, roles, authentication, Twilio integration for SMS services, and cryptographic operations.


## Features

- **Authentication Module**: Handles user authentication and authorization.
- **User Module**: Manages user data, including CRUD operations.
- **Twilio Service**: Integration with Twilio for SMS services.
- **Crypto Service**: Provides cryptographic operations for secure data handling.

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org/) (if running outside Docker)
- [NestJS CLI](https://nestjs.com/) (if running outside Docker)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/user-service.git
    cd user-service
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

### Configuration

1. Create a `.env` file based on the `.env.example` template.

2. Update the configuration variables in the `.env` file as needed.

### Running the Microservice

#### Using Docker


1. Run the Docker container:

    ```bash
    docker compose up --build
    ```

#### Locally (without Docker)

1. Start the application:

    ```bash
    npm run start:dev
    ```

### Usage

The microservice exposes various endpoints for managing users, roles, and authentication. Here are some common endpoints:

- **User Endpoints**:
  - `GET /api/v1/user/`: Get users.
  - `POST /api/v1/user/create`: Create a new user.
  - `POST /api/v1/user/kyc/`: Update a user's Kyc.
  - `POST /api/v1/user/role`: Update a user's role.



- **Authentication Endpoints**:
  - `POST /api/v1/auth/send-otp`: Send Otp.
  - `POST /api/v1/auth/resend-otp`: Resend Otp.
   - `POST /api/v1/auth/verify-otp`: Verify Otp.

[Postman documentation for reference](https://documenter.getpostman.com/view/32751383/2sA35LVz62)

### Contributing

Contributions are welcome! If you'd like to contribute to this microservice, please follow these steps:

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/new-feature`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Create a new Pull Request.

### License

This project is licensed under the [MIT License](LICENSE).

---

Feel free to customize the README according to your specific project structure and requirements. You can add more detailed instructions, examples, or usage guidelines as needed.
