## Contributing
When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

### Pull Request Process
### Step 1: Fork the repository
Fork the briza-insurance/illogical repository to your GitHub organization. This means that you'll have a copy of the repository under your-GitHub-username/repository-name.

### Step 2: Create a new empty repository on your local machine and clone the briza-insurance's repository from GitHub to your system
Create a new empty repository on local machine using the following command:
```
git init
```
Clone the repository on your local machine:
```
git clone https://github.com/{your-GitHub-username}/briza-illogical.git
```
### Step 3: Create a new branch
```jsx
git checkout -b branch-name
```
branch-name Naming convention:
```jsx
<type>/<type-name or issue-number>
```
  
#### Types:
- **Feature**: A new feature
- **Bug**: Generally describe issues that are found and resolved during production or testing phases or even after deployment.
- **Hotfix**: A hotfix is code that fixes a bug in a product and are applied only after the product has been released and is live.
- **Docs**: Changes to the documentation
- **Style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc.)
- **Refactor**: A code change that neither fixes a bug nor adds a feature
- **Perf**: A code change that improves performance
- **Test**: Adding missing or correcting existing tests

### Step 4: Make your changes
Update the code with your bug fix or new feature.

### Step 5: Add the changes that are ready to be committed

Stage the changes that are ready to be committed:

```jsx
git add .
```

### Step 6: Commit your changes

Commit the changes with a short message. 

```jsx
git commit -m "Some message"
```

### Step 7: Push the changes to the remote repository

Push the changes to the remote repository using:

```jsx
git push origin branch-name
```

### Step 8: Create Pull Request

In GitHub, do the following to submit a pull request to the upstream repository:

1.  Give the pull request a title and a short description of the changes made. Include also the issue or bug number associated with your change. Explain the changes that you made, any issues you think exist with the pull request you made, and any questions you have for the maintainer.
Remember, it's okay if your pull request is not perfect (no pull request ever is). The reviewer will be able to help you fix any problems and improve it!

2.  Wait for the pull request to be reviewed by a maintainer.

3.  Make changes to the pull request if the reviewing maintainer recommends them.

Celebrate your success after your pull request is merged :-)

> Please make an issue first if the change is likely to increase.