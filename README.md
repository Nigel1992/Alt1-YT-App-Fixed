See: https://runeapps.org/forums/viewtopic.php?pid=5473#p5473

----------

I actually found a way to get the app to work again using my own YouTube API Key.
You can use the new YouTube app using: [url]alt1://addapp/https://nigel1992.github.io/Alt1-YT-App-Fixed/appconfig.json[/url]

[u]A few things to keep in mind:[/u]
* This app is still being worked on and improved.
* Google has set a limit on how much it can be used, which is 10,000 requests per day. What this means is, if, for example, 100 people are using it, each person can watch up to 100 videos in a day, depending on how many requests the other users have made.
I'm working on a feature that allows you to use your own account which bypasses this issue completely, and lets you use your own subscriptions, etc...
* History and activity of the YT App can be seen by anyone [since its using a public API key].


[b]Screenshots of the app[/b]
[img]https://i.imgur.com/n3tmwQJ.png[/img]

GIF VERSION: [img]https://i.gyazo.com/5377bba885532afd2ae03c318ccbdc9f.gif[/img]

[u][b]Currently working:[/b][/u]
* Search
* Playback

[u][b]To-do:[/b][/u]
* Login/authentication feature

--- BELOW IS FOR FUTURE UPDATES - FOR USING YOUR OWN ACCOUNT - CAN BE IGNORED FOR NOW ---
[b]
--------------------------------------------------------------------------------------------
------- INSTRUCTIONS FOR CREATING YOUR OWN API KEY AND CLIENT-ID ------- 
--------------------------------------------------------------------------------------------
[/b]
[u]NOTE: Keep your YT-API-KEY and CLIENT-ID private, and do not share it with anyone [not even on this forum][/u]








[b]Instructions for making your own YT-API-KEY and CLIENT ID[/b]

[b]Step 1: Sign Up for Google Cloud[/b]

[b]Go to Google Cloud Console[/b]: Visit [url=https://console.cloud.google.com/]Google Cloud Console[/url].
[b]Sign In[/b]: Use your Google account to sign in. If you don't have one, create a Google account first.

[b]Step 2: Create a New Project[/b]

[b]Create a New Project[/b]:
Click on the project dropdown at the top of the page.
Click on "New Project".
Enter a project name and select your organization (if applicable), then click "Create".

[b]Step 3: Enable YouTube Data API[/b]

[b]Navigate to APIs & Services[/b]:
From the left-hand menu, navigate to "APIs & Services" > "Library".
[b]Enable YouTube Data API[/b]:
Search for "YouTube Data API v3".
Click on it, then click "Enable".

[b]Step 4: Get API Key[/b]

[b]Create Credentials[/b]:
Go to "APIs & Services" > "Credentials".
Click "Create Credentials" and select "API key".
[b]Copy API Key[/b]:
An API key will be generated. Copy this key for later use.

[b]Step 5: Set Up OAuth Consent Screen[/b]

[b]OAuth Consent Screen[/b]:
Go to "APIs & Services" > "OAuth consent screen".
Select "External" if your app will be used by users outside your organization.
Fill in the required information (app name, user support email, etc.).
Save and continue.

[b]Step 6: Create OAuth 2.0 Client IDs[/b]

[b]Create Credentials[/b]:
Go back to "Credentials".
Click "Create Credentials" and select "OAuth 2.0 Client ID".
[b]Configure Consent Screen[/b]:
If not already done, complete the OAuth consent screen setup as described in Step 5.
[b]Create OAuth Client ID[/b]:
Select "Web application".
Enter a name for your OAuth client.
Under "Authorized redirect URIs", add [url=https://developers.google.com/oauthplayground]https://developers.google.com/oauthplayground[/url] (or your own redirect URI if you have one).
Click "Create".

[b]Step 7: Copy OAuth Client ID and Secret[/b]

[b]Copy Credentials[/b]:
Once created, a pop-up will display your Client ID and Client Secret. Copy these for later use.
[b]Download JSON[/b]:
You can also download the JSON file containing these credentials for future reference.
