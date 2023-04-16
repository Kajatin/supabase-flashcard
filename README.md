
<p align="center">
  <img width="480" height="270" src="images/banner.svg">
</p>

A fun way to learn languages. Create collections with cards and utilize the help of AI to generate explanations and translations.

This project was created for the [Supabase Launch Week 7](https://supabase.com/launch-week) hackathon.

Created by: **Roland Kajatin** ([GitHub](https://github.com/Kajatin/supabase-flashcard) & [Twitter](https://twitter.com/rolandkajatin))

---

In this project, I used Supabase as a **database** to store collections and cards with row level security. I also used it for user **authentication**. Users can sign up with their email address and password. Policies protect the database tables from unauthorized access.

You can **provide your own OpenAI API key** under settings to generate explanations and translations. The API key is NOT
stored in the database. It is only used on the client and when calling the OpenAI API. I do not have
enough credits to supply my own key, so you will have to provide your own. 🤓

<p align="center">
  <img width="600" height="400" src="images/demo.gif">
</p>
