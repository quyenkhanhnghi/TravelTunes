
# Travel Tunes

Travel Tunes is a web-based marketplace built using the MERN stack. 

The platform allows consumers to research, review and book travel products and services directly with travel suppliers. 

The project is currently in progress, with a focus on 
  - desgining API & RESTfulAPI using CRUD operations with Moogosh
  - refactoring the Model-View-Controller (MVC) architecture
  - connecting a hosted database in MongoDB with the Express app.

In the future, the project will be updated with
  - Error Handling with Express
  - Authentication, Authorization and Security
  - Server-Side Rendering
  - Advanced Features: Payment, Email and File Uploads




## API Reference

#### Get all tours

```http
  GET /api/v1/tours
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `tours` | `string` | **Required**.                |

#### Create new tour
```http
  POST /api/v1/tours
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `tours`      | `string` | **Required**.                  |

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
