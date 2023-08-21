
# Travel Tunes

Travel Tunes is a web-based marketplace built using the MERN stack. 

The platform allows consumers to research, review and book travel products and services directly with travel suppliers. 

The project is currently in progress, with a focus on 
  - Desgining API & RESTfulAPI using CRUD operations with Moogosh
  - Refactoring the Model-View-Controller (MVC) architecture
  - Connecting a hosted database in MongoDB with the Express app.
  - Error Handling with Express
  - Authentication, Authorization and Security
  - Server-Side Rendering
  - Advanced Features: Payment Integration with Stripe, and File Uploads
  - Incorporated TypeScript with React to provide a more robust and type-safe user interface. 

In the future, the project will be updated with
  - Documentations for API reference & application
  - Leveraging Amazon S3 for seamless file uploads, ensuring efficient data management and storage
  - Deploying application to AWS


## API Reference - still updated for users & reviews & bookings

#### Get all tours

```http
  GET /api/v1/tours
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
|no parameter | `string` | **Required**.                |

#### Create new tour
```http
  POST /api/v1/tours
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
|no parameter | `string` | **Required**.                  |

#### Get tour

```http
  GET /api/v1/tours/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |

#### Update existed tour
```http
  PATCH /api/v1/tours/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |

#### Delete tour
```http
  DELETE /api/v1/tours/:id
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |



## Authors

- [@nghiquyen](https://github.com/quyenkhanhnghi)
