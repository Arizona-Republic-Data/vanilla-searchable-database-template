# Getting started with Vanilla Searchable

Your comprehensive guide to using the updated vanilla-searchable-database framework to generate your own working databases.

## What you will make

A searchable database that has a drop-down filter and can have sortable columns. Here's an example of what that could look like: <https://storage.googleapis.com/azr-data-public/graphics/complaints-db/index.html?v=2024.1>

## Prerequisites

-   a github account
-   access to the vanilla-searchable-database repository
-   a cleaned and prepped dataset in csv format

A note, from the very beginning: in order to deploy this database, you need credentials connecting you to google storage. Because it is not recommended to hand out credentials to developer spaces like those (partially for security reasons), you'll need the help of a data team member to deploy your database.

## People to contact

Sahana Jayaraman email me: [sahanasjayaraman\@gmail.com](mailto:sahanasjayaraman@gmail.com){.email} text me: (503) 360-2948

## Step 1: Opening github codespaces

Sign into github. Then, click on [this hyperlink](https://github.com/Arizona-Republic-Data/vanilla-searchable-database-template/tree/updated-eng) so you're directed straight to the vanilla-searchable-database-template repository.

> IMPORTANT: you should be on the 'updated-eng' branch. You can check by taking a peek at the gray button in the upper left of the page --- it should have a symbol that looks like a tree branch and say 'updated-eng'. If it says 'main,' or 'test,' or anything other than 'updated-eng,' make sure to click on it and switch to the 'updated-eng' branch.

Once you're sure you're in the updated-eng branch, click on the green button on the left side of the page that says "\<\> Code" on it.

You'll see two tabe on the window that drops down. Click on the one that says 'codespaces.'

Then click on the plus sign to open a new codespace on the branch. Wait for it to initialize!!

> Helpful sidenote: If you want to change the theme of your codespace (I personally much prefer it to be dark) go to the menu in the upper left corner of codespaces (denoted by three horizontal lines) and click on "File" \> "Preferences" \> "Theme" \> "Color Theme." Select your desired colortheme from there!

## Step 2: Installing \~ dependencies \~

At the bottom of your codespace, you'll see a tab that says 'Terminal.' Codespaces should immediately put you in this tab, but if it doesn't, navigate to it.

Then, you'll run the following command:

``` bash
npm install
```

If that runs right, you'll see a bunch of messages (incluing a scary-looking one about vulnerabilities --- don't worry about this) but you will also see a line that looks kind of like this:

``` bash
@sahanasjay ➜ /workspaces/vanilla-searchable-database-template (test) $ 
```

appear under those messages.

## Step 3: Uploading your data

You'll see that the menu on the left side of your codespace has a bunch of files and folders. Navigate to the folder called "src." You'll see another folder inside called "data." That folder already has data in it right now, a csv called data.csv.

The data that's in there right now is assisted living and nursing home complaint data. It's in there purely for demonstrative purposes, so you'll want to replace it with whatever data you're trying to place in the database!

Right-click on the folder, and you'll see an option to 'Upload.' Go ahead and upload the data you want to use.

> IMPORTANT: The data you upload must be called "data," and it must be in csv format. It should be clean and pre-processed already (so, in it'd final form).

## Step 4: Transforming your data

You'll be staying in the 'src' folder for this step. Go ahead and click on the folder called 'scripts' inside the 'src' folder. Inside, you'll see a script called 'transform-data.mjs'

Click on it!

This is a simplified version of a pre-processing script. It has the potential for customization (so, coders, if you're not coming in with clean data and you want to process your data with javascript functions, you can update this script to do anything you want to your data).

Most users will only be changing one line in this script --- the line that looks like this:

``` javascript
const sortBy = "COL_TO_SORT_BY";
```

You'll be replacing the "COL_TO_SORT_BY" with the name of the column you want your data sorted on (so, for example, with the complaint data, we can use "Facility_Name"). Make sure that the way you're typing the column name **perfectly matches** the colname in the data (otherwise, this will not work!)

Then, go down to your terminal. Copy and paste the following command:

    npm run build:data

hit enter, and presto! You'll see a new folder called "data" under the "public" folder. In that folder, you'll see a data.json. This is the processed version of your data that will be used to generate your table!

You'll notice that in data.json, all your column headers have been standardized: they are all lowercase, and all spaces have been replaced with underscores. **These are the column names you'll be using moving forward**.

## Step 5: Customizing your table in main.js

1)  Click on the file labeled "main.js"

2)  Change the appSlug to a slug that reflects your database. I used "complaints-db" for the complaints database

3)  If your data has a unique id column, put the name of that column in quotes next to the idCol. If your data does not have a unique id column, leave this part of the code unchanged

4)  Replace "COLUMN_TO_FILTER" with the name of whatever column you want populating the dropdown filter. (Remember, you're using the version of the column heads that is in data.json. So I would refer to the facility name column as "facility_name" in main.js)

5)  Replace the colnames in the displayHeadings variable with the columns you want shown in the table, and give them pretty public-facing titles (for example, ["complaint_date", "Complaint Date"]).

6)  Replace the column names next to sortable with columns that you think the audience should be able to sort by (one more reminder here: using column names from data.json)

7)  go to line 432. You're going to want to update this html, because it determines how your dropdowns are generated.

    a)  you should see five chunks that look like this:

    ``` html
    <div class="detail-field-group">
        <dt data-field-name="UNIQUE_NAME_FOR_FIELD">Colname</dt>
        <dd data-field-name="UNIQUE_NAME_FOR_FIELD">${record.colname}</dd>
    </div>
    ```

    each of these `<div>` tags represent a line of information that will be displayed in the dropdown menu for each row. You can copy and paste `<div>` tags to add more information in the dropdown.

    > IMPORTANT: There are probably columns that you don't always want showing (since the generated table will be a responsive iframe, we want it made so the data stores in visible columns can drop down into the toggled menus). You should have these columns named in the displayHeadings variable from step 5. You should also create `<div>` tags for them here. We'll make sure they're hidden from the dropdown and showing in the columns (and vice versa) in the appropriate manner in our `style.css` file. More on that later.

    b)  You'll be editing these tags:

    ``` html
    <dt data-field-name="UNIQUE_NAME_FOR_FIELD">Colname</dt>
    <dd data-field-name="UNIQUE_NAME_FOR_FIELD">${record.colname}</dd>
    ```

    replace "UNIQUE_NAME_FOR_FIELD" **in both rows** with a unique name for your field. For example, if you want the information from a complaint_date column in your data to show up in the dropdown, you could replace "UNIQUE_NAME_FOR_FIELD" with "complaintdt." This value could be anything, so long as it is unique --- the `<dt>` and `<dd>` tags in a single div should have the same `data-field-name`, but you can't reuse that same name in another `<div>` tag.

    c)  replace the 'Colname' betwen `<dt>` tags with whatever you want the public-facing label for your data to be. Staying with the complaint_date analogy, I'd replace 'Colname' with 'Complaint Date'

    d)  replace the 'colname' in `${record.colname}` with your column name (the way it's formatted in your data.json). for the complaint_date col,it would look like: `${record.complaint_date}`

    e)  do this for as many `<div>` tags as it takes to get all the info into your dropdowns.

That should be all the changes you have to make in main.js!

## Step 6: Updating your css

1)  Click on the file labeled 'style.css'

2)  On a Mac, hit command + F (on a windows, CTRL + F) and search "@todo" --- this will lead you to a chunk of code where you'll see the following:

``` css
th:nth-child(4),
td:nth-child(4),
th:nth-child(5),
td:nth-child(5) {
  display: none;
}

/* At slightly larger widths, show col 4 */
@media screen and (min-width: 425px) {
  th:nth-child(4),
  td:nth-child(4) {
    display: table-cell;
  }
/* Hide the contents of col 4 from the dropdown menu */
  dt[data-field-name="data-field-name-here"],
  dd[data-field-name="data-field-name-here"] {
    display: none;
  }
}

/* At wider displays, show col 5 */
@media screen and (min-width: 600px) {
  th:nth-child(5),
  td:nth-child(5) {
    display: table-cell;
  }
/* Hide the contents of col 5 from the dropdown menu */
  dt[data-field-name="data-field-name-here"],
  dd[data-field-name="data-field-name-here"] {
    display: none;
  }
}
```

This is where you determine what columns are shown and hidden, depending on the size of the browser window/container in which you database will be displayed.

To make things easier on you, each of you columns are identified by a number. The first column --- column 1 --- will always be the 'column' that contains the dropdown button.

The first column of your database will be column 2, and so on and so forth.

Best practice, I have found, is to have the dropdown buttons and two other columns on display at the narrowest screenwidth.

To show and hide columns, you'll be replacing the numbers in the parentheses. Replace `data-field-name-here` with a data-field-name (remember, you set those in main.js --- refer to step 5, section 7b - 7e of this document for a refresher). When you do that, you'll be hiding data from your dropdown menu.

So, for example, let's say you have a database of complaints with four columns that you want showing at the widest position. At the narrowest screen width, two of your columns --- complaint date, column 4, with a `data-field-name` of "complaintdt"; and complaint outcome, column 5, with a `data-field-name` of "complaintout" --- will be hidden from the main view and visible in the dropdown menu.

At a medium screen width width, you want the complaint date to be visible as a column, and to disappear from the dropdown menu. So, under `@media screen and (min-width: 425px)`, you're going to make sure that the number in the parentheses is 4 (since it's the fourth column in your database).

Then, you'll replace the "data-field-name-here" with "complaintdt." This ensures that when you show complaint date in the column view, it's hidden from each row's dropdown menu.

If this feels confusing/hard to understand, please don't hesitate to reach out! More than happy to help.

## Step 7: Updating index.html

This part is pretty simple, promise. Click on the file labeled 'index.html'

There are only two things you have to change in here:

1)  The title. Go to line 8 of the document, you'll see:

``` html
<title>Vanilla Searchable Database</title> 
```

Change this to a title that makes sense for your database. The title is what shows up when you hover over a tab in your browser.

2)  The google analytics id. Copy the following:

UA-166840762-12

Then, go to line 33 of index.html and replace UA-166840762-1 with what you just copied.

That's it!

## Step 8: Viewing your database

Navigate back to the 'Terminal' window at the bottom of your screen, the one you used at the very beginning of your database creation journey to `npm install`.

Then, go ahead and copy and paste the following command into that terminal:

``` bash
npm run dev 
```

Hit enter. You should see another tab in that lower section called 'PORTS'. Navigate to that tab, and you should see a row there with a value called "Forwarded Address". Under that header, you'll see a little symbol that looks like this: 🌐

Click on it, and it'll open a browser window where you'll be able to see your database! Play with it, use developer tools in your browser to test how it looks responsively and fiddle with the settings using the steps above if needed. Navigate back to your codespaces 'Terminal' tab and hit ctrl + c to exit your dev server. Run the `npm run dev` command again if you want to restart the dev server!

## Step 9: Updating the README

Once your database looks good and ready, go ahead and click on the file labeled 'README.md'. Update lines 3-30 of this document to better describe your project.

## Step 10: Saving your project and committing it to github!

Your database is finished! Huzzah, and congrats. Now, let's save it so you can alert the data team that it's ready to be deployed!

Navigate to your 'Terminal' tab and type the following:

``` bash
git branch <name-of-your-db>
```

> IMPORTANT: remember to replace `<name-of-your-db>` with a name reflecting your data. Carrying on the complaints database analogy, I would type:

``` bash
git branch complaints-db
```

Hit enter. Then, type:

``` bash
git checkout <name-of-new-branch>
```

Hit enter again. Now, copy paste the below:

``` bash
git add .
```

Hit enter, and type:

``` bash
git commit <name-of-branch> -m "<short-description-of-your-adds-here>"
```

Enter again! Finally, just type:

``` bash
git push origin <name-of-branch>
```

And that's it! Congrats!
