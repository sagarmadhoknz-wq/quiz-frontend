# Submission Support Note

## Fully Ready For Screenshots

- Login page
- Admin dashboard
- Admin tournament table with required columns:
  - Creator
  - Name
  - Category
  - Difficulty
- Create tournament modal
- Update tournament modal
- Delete tournament confirmation
- Tournament detail page showing question text and API-returned options
- Player dashboard
- Player tournament browsing
- One-question-per-page quiz flow
- Result screen

## Partially Implemented Due To Backend Limitations

- Admin question detail requirement for exact correct answer and incorrect answers
  - Backend entity stores them, but `QuestionResponse` does not expose them
  - UI shows this limitation honestly with TODO messaging
- Correct/incorrect feedback after each player answer
  - Not possible with current backend DTOs and endpoints
- Automatic score calculation from answers
  - Not possible because the backend does not expose answer keys or an answer-check endpoint
- Role-based auth from API
  - Frontend currently identifies the seeded admin user by username/email because the backend response has no role field

## Recommended Screenshots

1. Login page with admin shortcut visible
2. Admin dashboard table showing Creator, Name, Category, Difficulty
3. Create tournament modal open
4. Update tournament modal open
5. Delete confirmation modal open
6. Admin tournament details page showing Question Details
7. Player dashboard with tournament cards
8. Player tournament detail page with leaderboard section
9. Quiz play page showing one question and answer options
10. Result page showing final submitted score

## Notes For Explanation

- Emphasize that the frontend uses the real backend endpoints and DTOs already present.
- Emphasize that unsupported rubric items were isolated honestly instead of being guessed.
- Mention that tests were added for create, update, delete, and question viewing using mocked service calls.
