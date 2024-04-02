# Getting started with Vanilla Searchable 

Your comprehensive guide to using the updated vanilla-searchable-database framework to generate your own working databases. 

## What you will make

A searchable database that has a drop-down filter and can have sortable columns. Here's an example of what that could look like: https://storage.googleapis.com/azr-data-public/graphics/complaints-db/index.html?v=2024.1

## Prerequisites 

- a github account 
- access to the vanilla-searchable-database repository 
- a cleaned and prepped dataset in csv format 

A note, from the very beginning: in order to deploy this database, you need credentials connecting you to google storage. Because it is not recommended to hand out credentials to developer spaces like those (partially for security reasons), you'll need the help of a data team member to deploy your database.

## Step 1: Opening github codespaces 

Sign into github. Then, click on [this hyperlink](https://github.com/Arizona-Republic-Data/vanilla-searchable-database-template/tree/updated-eng) so you're directed straight to the vanilla-searchable-database-template 
repository. 

Important: you should be on the 'updated-eng' branch. You can check by taking a peek at the gray button in the upper left of the page —
it should have a symbol that looks like a tree branch and say 'updated-eng'. If it says 'main,' or 'test,' or anything other than 'updated-eng,' make sure to click on it and switch to the 'updated-eng' branch. 

Once you're sure you're in the updated-eng branch, click on the green button on the left side of the page that says "<> Code" on it. 

You'll see two tabe on the window that drops down. Click on the one that says 'codespaces.'

Then click on the plus sign to open a new codespace on the branch. Wait for it to initialize!! 

> Helpful sidenote: If you want to change the theme of your codespace (I personally much prefer it to be dark) go to the menu in the upper left corner of codespaces (denoted by three horizontal lines) and click on "File" > "Preferences" > "Theme" > "Color Theme." Select your desired colortheme from there! 

## Step 2: Installing ~ dependencies ~ 

At the bottom of your codespace, you'll see a tab that says 'Terminal.' Codespaces should immediately put you In this tab, but if it doesn't, navigate to it. 

Then, you'll run the following command:

```
npm install
```

If that runs right, you'll see a bunch of messages (incluing a scary-looking one about vulnerabilities — don't worry about this) but you will also see a line that looks like this:
```
@sahanasjay ➜ /workspaces/vanilla-searchable-database-template (test) $ 
```
appear under those messages. 

## Step 3: Uploading your data 

You'll see that the menu on the left side of your codespace has a bunch of files and folders. Navigate to the folder called "src." You'll see another folder inside called "data." That folder already has data in it right now, a csv called data.csv. 

The data that's in there right now is assisted living and nursing home complaint data. It's in there purely for demonstrative purposes, so you'll want to replace it with 

Right-click on the folder, and you'll see an option to 'Upload.' Go ahead and upload the data you want to use. 

> Important: The data you upload must be called "data," and it must be in csv format. It should be clean and pre-processed already (so, in it'd final form).

## Step 4: Transforming your data 

You'll be staying in the 'src' folder for this step. Go ahead and click on the folder called 'scripts' inside the 'src' folder. Inside, you'll see a script called 'transform-data.mjs'

Click on it!

This is a simplified version of a pre-processing script. It has the potential for customization (so, coders, if you're not coming in with clean data and you want to process your data with javascript functions, you can update this script to do anything you want to your data).

Most users will only be changing one line in this script — the line that looks like this: 

```javascript
const sortBy = "COL_TO_SORT_BY";
```
You'll be replacing the "COL_TO_SORT_BY" with the name of the column you want your data sorted on (so, for example, with the complaint data, we can use "Facility_Name"). Make sure that the way you're typing the column name **perfectly matches** the colname in the data (otherwise, this will not work!)

Then, go down to your terminal. Copy and paste the following command:

```
npm run build:data
```

hit enter, and presto! You'll see a new folder called "data" under the "public" folder. In that folder, you'll see a data.json. This is the processed version of your data that will be used to generate your table!

You'll notice that in data.json, all your column headers have been standardized: they are all lowercase, and all spaces have been replaced with underscores. **These are the column names you'll be using moving forward**. 

## Step 5:  Customizing your table in main.js 

1) Click on the file labeled "main.js"

2) Change the appSlug to a slug that reflects your database. I used "complaints-db" for the complaints database

3) If your data has a unique id column, put the name of that column in quotes next to the idCol. If your data does not have a unique id column, leave this part of the code unchanged 

4) Replace "COLUMN_TO_FILTER" with the name of whatever column you want populating the dropdown filter. (Remember, you're using the version of the column heads that is in data.json. So I would refer to the facility name column as "facility_name" in main.js)

5) Replace the colnames in the displayHeadings variable with the columns you want shown in the table, and give them pretty public-facing titles (for example, ["complaint_date", "Complaint Date"]). 

6) Replace the column names next to sortable with columns that you think the audience should be able to sort by (one more reminder here: using column names from data.json)

7) go to line 432. You're going to want to update this html, because it determines how your dropdowns are generated.

That should be all the changes you have to make in main.js!