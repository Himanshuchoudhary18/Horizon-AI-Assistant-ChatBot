interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface QAData {
  question: string;
  answer: string;
}

export const qaDataset: QAData[] = [
  // Previous questions remain...
  // Adding more sophisticated questions and answers...

  // Programming & Development
  {
    question: "What is a REST API?",
    answer: "A REST (Representational State Transfer) API is an architectural style for distributed systems. It uses HTTP methods like GET, POST, PUT, and DELETE to perform operations on resources. REST APIs are stateless, cacheable, and provide a standardized way for web services to communicate."
  },
  {
    question: "Explain Docker",
    answer: "Docker is a platform for developing, shipping, and running applications in containers. Containers package an application with all its dependencies, ensuring it works consistently across different environments. This makes deployment easier and more reliable."
  },
  {
    question: "What is CI/CD?",
    answer: "CI/CD (Continuous Integration/Continuous Deployment) is a software development practice where code changes are automatically built, tested, and deployed. CI ensures code quality through automated testing, while CD automates the deployment process, enabling faster and more reliable software delivery."
  },

  // Web Development
  {
    question: "What is responsive design?",
    answer: "Responsive design is an approach to web design that makes web pages render well on different devices and window sizes. It uses fluid grids, flexible images, and CSS media queries to create a dynamic viewing experience that adapts to various screen sizes."
  },
  {
    question: "Explain CORS",
    answer: "CORS (Cross-Origin Resource Sharing) is a security feature implemented by browsers that controls how web pages in one domain can request and interact with resources from another domain. It helps prevent unauthorized cross-origin requests while allowing legitimate ones through specific HTTP headers."
  },

  // Software Architecture
  {
    question: "What is microservices architecture?",
    answer: "Microservices architecture is a design approach where an application is built as a collection of small, independent services. Each service runs in its own process and communicates through well-defined APIs. This architecture enables better scalability, maintainability, and independent deployment of services."
  },
  {
    question: "Explain dependency injection",
    answer: "Dependency Injection is a design pattern where objects receive their dependencies from external sources rather than creating them internally. This promotes loose coupling, makes code more testable, and improves maintainability by separating object creation from business logic."
  },

  // Database
  {
    question: "What is SQL vs NoSQL?",
    answer: "SQL databases are relational databases that use structured query language and predefined schemas (like MySQL, PostgreSQL). NoSQL databases are non-relational and offer flexible schemas (like MongoDB, Redis). SQL is better for complex queries and transactions, while NoSQL excels in handling large volumes of unstructured data and rapid changes."
  },
  {
    question: "Explain database indexing",
    answer: "Database indexing is a data structure technique that improves the speed of data retrieval operations by providing quick access to rows in a database table. It's similar to a book's index, allowing the database to find data without scanning the entire table."
  },

  // Security
  {
    question: "What is XSS?",
    answer: "Cross-Site Scripting (XSS) is a security vulnerability that allows attackers to inject malicious scripts into web pages viewed by other users. It can be prevented by properly sanitizing user input, using content security policies, and encoding output data."
  },
  {
    question: "Explain JWT",
    answer: "JSON Web Tokens (JWT) are a compact, URL-safe means of representing claims between parties. They're often used for authentication and information exchange, containing encoded JSON data and a signature to verify authenticity. JWTs are stateless and can include user data directly in the token."
  },

  // Cloud Computing
  {
    question: "What is cloud computing?",
    answer: "Cloud computing is the delivery of computing services (including servers, storage, databases, networking, software) over the Internet. It offers benefits like scalability, cost-effectiveness, and flexibility, allowing businesses to pay only for the resources they use."
  },
  {
    question: "Explain serverless computing",
    answer: "Serverless computing is a cloud computing model where the cloud provider automatically manages the infrastructure. Developers just write and deploy code in the form of functions, without worrying about servers. It offers automatic scaling and pay-per-execution pricing."
  },

  // AI & Machine Learning
  {
    question: "What is deep learning?",
    answer: "Deep learning is a subset of machine learning that uses neural networks with multiple layers (deep neural networks) to analyze various factors of data. It's particularly powerful in tasks like image and speech recognition, natural language processing, and making predictions."
  },
  {
    question: "Explain neural networks",
    answer: "Neural networks are computing systems inspired by biological neural networks in human brains. They consist of interconnected nodes (neurons) organized in layers that can learn patterns from data. Neural networks are fundamental to modern AI and can solve complex problems in various domains."
  },

  // Version Control
  {
    question: "What is Git?",
    answer: "Git is a distributed version control system that tracks changes in source code during software development. It allows multiple developers to work together, maintain different versions of code, and merge changes efficiently. Git helps in managing code history and collaborative development."
  },
  {
    question: "Explain branching in Git",
    answer: "Branching in Git allows developers to diverge from the main line of development and work independently without affecting the main codebase. It's useful for developing features, fixing bugs, or experimenting without risking the stability of the main code."
  },

  // Software Testing
  {
    question: "What is unit testing?",
    answer: "Unit testing is a software testing method where individual components or units of code are tested in isolation. It helps ensure that each part of the program works correctly independently. Unit tests are typically automated and run as part of the development process."
  },
  {
    question: "Explain TDD",
    answer: "Test-Driven Development (TDD) is a software development approach where tests are written before the actual code. The cycle includes writing a failing test, writing code to pass the test, and then refactoring. This ensures code quality and helps maintain clear requirements."
  },

  // Modern Web Technologies
  {
    question: "What is WebAssembly?",
    answer: "WebAssembly (Wasm) is a binary instruction format for stack-based virtual machines that enables high-performance execution of code in web browsers. It allows languages like C++ and Rust to run in the browser at near-native speed."
  },
  {
    question: "Explain Progressive Web Apps",
    answer: "Progressive Web Apps (PWAs) are web applications that provide a native app-like experience to users. They work offline, can be installed on devices, support push notifications, and offer fast performance while maintaining the reach and accessibility of web applications."
  },

  // Soft Skills & Project Management
  {
    question: "What is agile methodology?",
    answer: "Agile methodology is an iterative approach to project management and software development that emphasizes flexibility, customer feedback, and rapid delivery. It breaks projects into small increments called sprints, allowing for frequent reassessment and adaptation of plans."
  },
  {
    question: "Explain code review",
    answer: "Code review is a systematic examination of source code by team members to find and fix mistakes, improve code quality, and ensure adherence to coding standards. It's a crucial practice that helps maintain code quality, share knowledge, and catch potential issues early."
  },

  // System Design
  {
    question: "What is load balancing?",
    answer: "Load balancing is the process of distributing network traffic across multiple servers to ensure no single server bears too much demand. This helps in maintaining high availability and reliability by preventing any single point of failure."
  },
  {
    question: "Explain caching",
    answer: "Caching is a technique of storing frequently accessed data in a faster storage system (cache) to reduce database load and improve application performance. Common caching strategies include in-memory caching, browser caching, and CDN caching."
  }
];

export type { ChatMessage, QAData };