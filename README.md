See: https://runeapps.org/forums/viewtopic.php?pid=5473#p5473

----------
# ALT1 YouTube App

I've found a way to get the app working again using my own YouTube API Key.  
You can now access the new YouTube app using the following link: ```alt1://addapp/https://nigel1992.github.io/Alt1-YT-App-Fixed/appconfig.json``` or use the link https://nigel1992.github.io/Alt1-YT-App-Fixed in Alt1 Browser, and click ADD APP.
(Simply paste into your browser's navigation bar and hit ENTER)

## Currently Working

- Search functionality
- Playback

## To-do

- Implement login/authentication feature

## Things to Note

- This app is still in development and undergoing improvements.
- Google has imposed a usage limit of 10,000 requests per day. Each user can watch up to 100 videos in a day, depending on the total requests made by other users. I'm currently working on a feature that allows you to use your own account, bypassing this limit and enabling access to your own subscriptions.
- The history and activity of the YT App can be viewed by anyone since it uses a public API key.

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
