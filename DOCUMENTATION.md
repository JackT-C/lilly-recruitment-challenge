Lilly Technical Challenge Documentation

Approach

I approached this challenge by first analyzing the objectives set out in the README file of the Git repository to ensure I had a clear understanding of the requirements. I then broke down the objectives into smaller tasks and prioritized functionality before refining the user experience.

I started by setting up my environment, ensuring that all dependencies were installed, and launching the provided start.bat file to start the backend.

After this, my main focus was ensuring that the frontend could successfully communicate with the backend, retrieve data from the data.json file, and display it correctly. To achieve this, I used various HTTP methods to allow CRUD (Create, Read, Update, Delete) operations:

GET: Retrieve all items from the JSON file.

POST: Create medicines.

PUT: Update Medicines

DELETE: Remove a medicine.

Whenever I faced a challenge or obstacle, I debugged using various techniques such as print statements, try-catch blocks, and proper error handling. If further assistance was needed, I efficiently researched the issue by searching for the returned error exception on platforms like StackOverflow.

Once the connection between the frontend and backend was established, it became easier to add the required functionalities such as displaying elements, creating, updating, and deleting medicines. I implemented these using forms for user input, allowing users to modify the medicine list dynamically.

Additionally, I implemented an optional feature to calculate the average price of all medicines. This was done by summing all valid prices and dividing by the number of medicines with valid prices, rounding the result to two decimal places.

After adding all the required functionality, I worked on clean CSS styling. Despite limited time, I managed to create a modern and clean design with a grey and red color scheme, resembling the Eli Lilly website.

Objectives - Innovative Solutions

While implementing the challenge objectives, I took extra measures to ensure efficiency and a smooth user experience.

For instance, to prevent missing or invalid data from causing crashes, I implemented default fallback values. If null entries were present in the data.json file, placeholders such as "Name Unavailable" or "Price Unavailable" would be displayed. This ensured that even incomplete data remained readable and formatted for the user.

Initially, when sending data to the backend, manual JSON input was required, which was not optimal. Instead, I designed structured forms with clear input fields and validation to prevent invalid entries.

Furthermore, I implemented asynchronous fetch calls with await to ensure that data retrieval and updates occurred smoothly without blocking the UI.

I also adjusted the color scheme in the CSS file later in development to match Eli Lilly's branding, making the UI more familiar and improving the user experience.

I am particularly proud of how I handled missing data and optimized the UI to create a seamless user experience. These solutions made the application more robust and user-friendly.

Problems Faced

One challenge I encountered was implementing the optional average price function in the backend. The backend did not have a built-in method for this calculation. To solve this, I created a new method in the main.py file, which dynamically calculates the average price and returns it to the frontend.

Additionally, I faced some early communication issues between the frontend and backend. Initially, items from the database were not displaying correctly. Through debugging, I found that some medicines in the database had missing names or prices, which caused errors and prevented data display. To resolve this, I implemented default fallback values, ensuring frontend stability and readability.

Creating a user-friendly UI was also challenging, especially with limited remaining time, as most of my effort was spent on functionality. However, I took inspiration from the Lilly website and developed a simple yet effective UI, ensuring clear buttons, text fields, and a structured layout that met the challenge requirements.

Evaluation

Overall, this challenge was an engaging and insightful experience that tested my ability to work with both frontend and backend systems. I enjoyed the structured problem-solving approach and the hands-on implementation of real-world software development practices.

Strengths & Accomplishments:

Successfully established effective communication between frontend and backend.

Ensured missing data did not break the application by implementing fallback values.

Designed user-friendly forms for easy data entry.

Implemented an optional average price calculation feature.

Created a simple yet effective UI that aligns with Lilly’s branding.

Challenges & Areas for Improvement:

Spent significant time on functionality, leaving less time for UI polish. Next time, I would focus more on improving visual appeal, adding animations, and enhancing user interactions.

If given more time, I would write unit tests for different scenarios to ensure robustness.

Conclusion:

I am happy with my implementation and the solutions I provided, making the application functional, resilient, and user-friendly.

