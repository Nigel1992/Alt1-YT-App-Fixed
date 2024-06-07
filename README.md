See: https://runeapps.org/forums/viewtopic.php?pid=5473#p5473

----------
# ALT1 YouTube App

Great news - I've taken a look at the old YouTube app and got the app back in action with some simple fixes.  
You can now access the new YouTube app using the following link: ```alt1://addapp/https://github.com/Nigel1992/Alt1-YouTube-App/appconfig.json``` or use the link ```https://github.com/Nigel1992/Alt1-YouTube-App``` in Alt1 Browser, and click ADD APP.  
(Simply paste into your browser's navigation bar and hit ENTER)


# Project Status

## Currently Working:

- Search
- Playback of videos/streams (see below for exception).

## Currently Not Working:

- Playback of LIVE/Recently live streams (see below for more info).

## To-Do:

- Implement login/authentication feature

## Important Notes:

- This application is still under development and continuous improvement.
- Google has imposed a limit on its usage, allowing up to 10,000 requests per day. This means that if multiple users are using the app, the number of videos each user can watch depends on the total requests (*) made by all users.
  - I'm currently developing a feature to allow users to bypass this limit by using their own accounts, enabling access to their subscriptions, etc.
- History and activity of the YouTube App can be seen by anyone, as it uses a public account/API key.
- Some livestreams that have recently finished may not be accessible immediately. Please try again later.
  
(*) This includes searches and views.


## Screenshots

![App Screenshot](https://i.imgur.com/n3tmwQJ.png)

![GIF Version](https://i.gyazo.com/5377bba885532afd2ae03c318ccbdc9f.gif)



## BELOW CAN BE IGNORED FOR NOW - FUTURE UPDATE

### Instructions for Creating Your Own API Key and Client ID

**NOTE: Keep your YT-API-KEY and CLIENT-ID private, and do not share it with anyone [not even on this forum]**

#### Step 1: Sign Up for Google Cloud

- Visit [Google Cloud Console](https://console.cloud.google.com/).
- Sign in using your Google account.

#### Step 2: Create a New Project

- Click on the project dropdown at the top of the page.
- Select "New Project".
- Enter a project name and organization (if applicable), then click "Create".

#### Step 3: Enable YouTube Data API

- Navigate to "APIs & Services" > "Library".
- Search for "YouTube Data API v3" and enable it.

#### Step 4: Get API Key

- Go to "APIs & Services" > "Credentials".
- Click "Create Credentials" and select "API key".
- Copy the generated API key.

#### Step 5: Set Up OAuth Consent Screen

- Go to "APIs & Services" > "OAuth consent screen".
- Select "External" if your app will be used by users outside your organization.
- Fill in the required information and save.

#### Step 6: Create OAuth 2.0 Client IDs

- Go back to "Credentials" and click "Create Credentials".
- Select "OAuth 2.0 Client ID" and configure the consent screen.
- Choose "Web application" and enter a name for your OAuth client.
- Add the authorized redirect URIs and click "Create".

#### Step 7: Copy OAuth Client ID and Secret

- Once created, copy the Client ID and Client Secret for later use.
- You can also download the JSON file containing these credentials for future reference.
