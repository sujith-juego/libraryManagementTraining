# libraryManagementTraining

## Project details:

Project is to create a library management service for users to borrow, List, and return the books. 

### Project flow: 
This contains two modules - 
  * User - where he is able to register or login.
  * Books - This is authenticated and users can Borrow, list and return books.

#### User module - 
* User should be able to create an account with user_name, email_id and password.
* User should not be able to register with existing email id.
* Once user creates an account, he/she should be able to login by providing email_id and password.
* It should generate an unique token to identify user.
* User should have provision to update password.
* User can logout from the system. When user logs out, he/she should not be able to call any of the APIs.
* There should be admin user who can add/update the books

#### Books module - 
  * User should have access to view all books available in the library. Each book detail should either user to borrow or already borrowed.
  * User should be able to view a particular book detail by passing book.
  * User can filter by availability of books/Category/Author.
  * Get books that only he/she has borrowed
  * When user passes book_id and return date, user should be assigned with the book
  * the book should be marked as borrowed and return date will be filled
  * User can return the book before or on the return date. If the book is returned after the return date, include the total time taken from return date to current date
  * Admin can create or update the books
  


