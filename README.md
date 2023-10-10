# Bank managment system

Please follow the instructions below to run the system locally:

1. Clone the app
2. Create .env file form the .env.example file
3. Create a database and update database's credentials in the .env file
4. Update smtp credentials in the .env file
5. Run the command
``` composer install ```
6. Run the command
``` php artisan migrate ```
7. Enter the react folder with the command
``` cd react ```
8. Run this command inside react folder
``` npm install ```
9. Go back to the root folder and run the laravel system with this command
``` php artisan serve ```
10. Enter the react folder with another terminal and enter this command
``` npm run dev ```

You can access the system from the browser from
``` http://localhost:5173/ ```

Create a new admin account and customer accounts from
``` http://localhost:5173/adminsignup ```

To login as a customer go to 
``` http://localhost:5173/login ```
