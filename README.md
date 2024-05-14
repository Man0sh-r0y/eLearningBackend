# Backend

## Tech Stack and Tools Used

- **Runtime Enviroment:** `Node Js`
- **Framework:** `Express Js`
- **DataBase:** `MongoDB`
- **For Auth:** `jwt`
- **For Sending Mail**: `NodeMailer`
- **For Sending OTP**: `Otp-Generator`
- **For Payment:** `RazorPay`
- **For Storing Media:** `Cloudinary`
- **For Hashing Password:** `bcrypt`

## Backend API Routing

### User Routes

1. **Send OTP:**

   - **Method**: POST
   - **API Route:**

     ```bash
       http://localhost:4000/api/v1/auth/sendotp
     ```

     #### **Test Data**


     ```json
     { "email": "manashroy830@gmail.com" }
     ```

     ```json
     { "email": "manashroy454@gmail.com" }
     ```

     ```json
     { "email": "manash.roy.fiem.cse21@teamfuture.in" }
     ```
2. **Sign Up:**

   - **Method:** POST
   - **API Route:**

     ```bash
      http://localhost:4000/api/v1/auth/signup
     ```

     #### **Test Data**


     ```json
     {
        "firstName":"Rahul",
        "lastName":"Singh",
        "password":"123456",
        "confirmPassword":"123456",
        "email":"manashroy830@gmail.com",
        "accountType":"Student",
        "otp":"yiSxph"
     }
     ```

     ```json
     {
      "firstName":"Manash",
      "lastName":"Roy",
      "password":"123456",
      "confirmPassword":"123456",
      "email":"manashroy454@gmail.com",
      "accountType":"Admin",
      "otp":"eVpJ3q"
     }
     ```

     ```json
     {
      "firstName":"Raj",
      "lastName":"Kumar",
      "password":"123456",
      "confirmPassword":"123456",
      "email":"manash.roy.fiem.cse21@teamfuture.in",
      "accountType":"Instructor",
      "otp":"JPYRxD"
     }
     ```
3. **Login:**

   - **Method:** POST
   - **API Route:**

     ```bash
      http://localhost:4000/api/v1/auth/login
     ```

     #### **Test Data**


     ```json
      {
        "email":"manashroy830@gmail.com",
        "password":"123456"
      }
     ```
4. **Change Password:**

   - **Method:** POST
   - **Authentication Required:** Yes (using middleware `auth`)
   - **API Route:**

     ```bash
      http://localhost:4000/api/v1/auth/changePassword
     ```

     #### **Test Data**


     ```json
     {
      	"oldPassword": "123456",
      	"newPassword": "100000",
      	"confirmPassword": "100000"
     }
     ```
5. **Generate Forgot Password Token:**

   - **Method:** POST
   - **API Route:**

     ```bash
       http://localhost:4000/api/v1/auth/forgotPasswordToken
     ```

     #### **Test Data**


     ```json
     {
       "email":"manashroy830@gmail.com"
     }
     ```
6. **Reset Forgot Password:**

   - **Method:** POST
   - **API Route:**

     ```bash
       http://localhost:4000/api/v1/auth/resetForgotPassword
     ```

     #### **Test Data**


     ```json
     {
        "password":"123456",
        "confirmPassword":"123456",
        "token":"token-code"
     }
     ```

### User's Profile Routes

1. **Update Profile:**

   - **Method:** PUT
   - **Authentication Required:** Yes (using middleware `auth`)
   - API Route:

     ```bash
     http://localhost:4000/api/v1/profile/updateProfile
     ```

     #### Test Data


     ```json
     {
      	"about": "Hello, I am a DEV. I have 3 years of experience in Backend Developement and specialize in Authentication and Authorization. I am passionate about Cloud. Please feel free to contact me for any inquiries or collaborations!",
      	"contactNumber": 125648959,
     	"dateOfBirth": "2002-01-31",
      	"gender": "MALE"
      }
     ```
2. **Delete Account:**

   - **Method:** DELETE
   - **Authentication Required:** Yes (using middleware `auth`)
   - **API Route:**

     ```bash
     http://localhost:4000/api/v1/profile/deleteAccount
     ```

     #### Test Data


     ```json
     {
         "email":"manashroy830@gmail.com",
         "password":"123456"
     }
     ```
3. **Cancel Delete Account:**

   - **Method:** PUT
   - **Authentication Required:** Yes (using middleware `auth`)
   - **API Route:**

     ```bash
     http://localhost:4000/api/v1/profile/cancelDeleteAccount
     ```
4. **Get All Details Of User:**

   - **Method:** GET
   - **Authentication Required:** Yes (using middleware `auth`)
   - **API Route:**

     ```bash
     http://localhost:4000/api/v1/profile/getAllDetailsOfUser
     ```
5. **Update Display Picture:**

   - **Method:** PUT
   - **Authentication Required:** Yes (using middleware `auth`)
   - **API Route:**

     ```bash
     http://localhost:4000/api/v1/profile/updateDisplayPicture
     ```

     #### Test Data (Upload it as `form-data`)


     ```bash
     displayPicture: 'choose file from local machine' # form-data
     ```
6. **Get Enrolled Courses:**

   - **Method:** GET
   - **Authentication Required:** Yes (using middleware `auth`)
   - **API Route:**

     ```bash
     http://localhost:4000/api/v1/profile/getEnrolledCourses
     ```

### Course Routes

1. **Create Category:**

   - **Method:** POST
   - **Authentication Required:** Yes (using middleware `auth`)
   - **Role Required:** Admin (using middleware `isAdmin`)
   - **API Route:**

     ```bash
     http://localhost:4000/api/v1/course/createCategory
     ```

     #### Test Data


     ```json
     {
         "name": "ML",
         "description": "ML is trending Now"
     }
     ```
2. **Create Course:**

   - **Method:** POST
   - **Authentication Required:** Yes (using middleware `auth`)
   - **Role Required:** Instructor (using middleware `isInstructor`)
   - **API Route:**

     ```bash
     http://localhost:4000/api/v1/course/createCourse
     ```

     **Test Data (Upload it as `form-data`)**

     ```bash
     thumbnail: upload the thumbnail file
     courseName: "MERN Stack Development",
     courseDescription: "MERN stack development is a process that uses JavaScript to build web applications that are scalable and robust",
     whatYouWillLearn: "HTML CSS JS React JS Node JS EXpress MongoDB", 
     price: 4000, 
     tag: "Development", 
     category: Write the Object ID of the Category
     ```
3. **Show All Courses:**

   - **Method:** GET
   - **API Route:**

     ```bash
     http://localhost:4000/api/v1/course/showAllCourses
     ```
4. **Get Course Details:**

   - **Method:** GET
   - **API Route:**

     ```bash
     http://localhost:4000/api/v1/course/getCourseDetails
     ```
5. **Create Section:**

   - **Method:** POST
   - **Authentication Required:** Yes (using middleware `auth`)
   - **Role Required:** Instructor (using middleware `isInstructor`)
   - **API Route:**

     ```bash
     http://localhost:4000/api/v1/course/createSection
     ```

     #### **Test Data**


     ```bash
     {
         "sectionName": "ML Basics - I",
         "courseId": Write the Object Id of the Course
     }
     ```

     ```bash
     {
         "sectionName": "ML Basics - II",
         "courseId": Write the same Object Id of the Course
     }
     ```
6. **Update Section:**

   - **Method:** POST
   - **Authentication Required:** Yes (using middleware `auth`)
   - **Role Required:** Instructor (using middleware `isInstructor`)
   - **API Route:**

     ```bash
     http://localhost:4000/api/v1/course/updateSection
     ```

     #### Test Data


     ```bash
     {
         "sectionName": "Machine Learning Basics I",
         "sectionId": Write the Object Id of the Section
     }
     ```
7. **Delete Section:**

   - **Method:** POST
   - **Authentication Required:** Yes (using middleware `auth`)
   - **Role Required:** Instructor (using middleware `isInstructor`)
   - **API Route:**

     ```bash
     http://localhost:4000/api/v1/course/deleteSection
     ```

     #### Test Data


     ```bash
     {
         "sectionId": Write the Object Id of the Section,
         "courseId": Write the Object Id of the Course
     }
     ```
8. **Create Sub-Section:**

   - **Method:** POST
   - **Authentication Required:** Yes (using middleware `auth`)
   - **Role Required:** Instructor (using middleware `isInstructor`)
   - **API Route:**

     ```bash
     http://localhost:4000/api/v1/course/createSubSection
     ```

     #### Test Data (Upload it as `form-data`)


     ```bash
     videoFile: upload the video file
     sectionId: Write the section id here
     title: "ML Lecture 1"
     description: "What is Machine Learning?"
     ```
9. **Update Sub-Section:**

   - **Method:** POST
   - **Authentication Required:** Yes (using middleware `auth`)
   - **Role Required:** Instructor (using middleware `isInstructor`)
   - **API Route:**

     ```bash
     http://localhost:4000/api/v1/course/updateSubSection
     ```

     #### Test Data


     ```json
     {
         "subSectionId": "66424091cd2c1a07e1100706",
         "title": "Machine Learning Lecture 1"
     }
     ```
10. **Delete Sub-Section:**

    - **Method:** POST
    - **Authentication Required:** Yes (using middleware `auth`)
    - **Role Required:** Instructor (using middleware `isInstructor`)
    - **API Route:**

      ```bash
      http://localhost:4000/api/v1/course/deleteSubSection
      ```

      Test Data

      ```bash
      {
          "sectionId": Write the Object Id of that section,
          "subSectionId": Write the Object Id of sub section
      }
      ```
11. **Show All Categories:**

    - **Method:** GET
    - **API Route:**

      ```bash
      http://localhost:4000/api/v1/course/showAllCategories
      ```
12. **Category Page Details:**

    - **Method:** GET
    - **API Route:**

      ```bash
      http://localhost:4000/api/v1/course/categoryPageDetails
      ```
13. **Create Rating And Review:**

    - **Method:** POST
    - **Authentication Required:** Yes (using middleware `auth`)
    - **Role Required:** Student (using middleware `isStudent`)
    - **API Route:**

      ```bash
      http://localhost:4000/api/v1/course/createRatingAndReview
      ```
14. **Update Rating And Review:**

    - **Method:** POST
    - **Authentication Required:** Yes (using middleware `auth`)
    - **Role Required:** Student (using middleware `isStudent`)
    - **API Route:**

      ```bash
      http://localhost:4000/api/v1/course/updateRatingAndReview
      ```
15. **Delete Rating And Review:**

    - **Method:** POST
    - **Authentication Required:** Yes (using middleware `auth`)
    - **Role Required:** Student (using middleware `isStudent`)
    - **API Route:**

      ```bash
      http://localhost:4000/api/v1/course/deleteRatingAndReview
      ```
16. **Get Average Rating:**

    - **Method:** GET
    - **API Route:**

      ```bash
      http://localhost:4000/api/v1/course/getAverageRating
      ```
17. **Get All Ratings And Reviews:**

    - **Method:** GET
    - **API Route:**

      ```bash
      http://localhost:4000/api/v1/course/getAllRatingsAndReviews
      ```

### Payment Routes

1. **Capture Payment:**

   - **Method:** POST
   - **Authentication Required:** Yes (using middleware `auth`)
   - **Role Required:** Student (using middleware `isStudent`)
   - **API Route:**

     ```bash
     http://localhost:4000/api/v1/payment/capturePayment
     ```
2. **Verify Signature:**

   - **Method:** POST
   - **API Route:**

     ```bash
     http://localhost:4000/api/v1/payment/verifySignature
     ```

### Contact Us Route

1. **Contact Us:**
   - **Method:** POST
   - **API Route:**

     ```bash
     http://localhost:4000/api/v1/contactUs
     ```
