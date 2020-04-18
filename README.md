<p align="center">
    <h1 align="center">
        <img width="40" src="https://raw.githubusercontent.com/cedoor/movigo/master/resources/icon.png">
        Movigo
    </h1>
    <p align="center">Ultralight JS library to animate your DOM elements.</p>
</p>
    
<p align="center">
    <a href="https://github.com/cedoor/movigo/blob/master/LICENSE" target="_blank">
        <img src="https://img.shields.io/github/license/cedoor/movigo.svg?style=flat-square">
    </a>
    <a href="https://david-dm.org/cedoor/movigo?type=dev" target="_blank">
        <img src="https://img.shields.io/david/dev/cedoor/movigo.svg?style=flat-square">
    </a>
</p>

Movigo is a light and modern JS animation library which makes the creation of DOM element animations easier.
Movigo use new ECMAScript features and the so-called method chaining technique, and save the state of the animation in each function.
This means that you can break the chain and create new chains with additional functions by building different animations.
Library functions correspond to specific CSS properties (actions) or to animation options (options).
You can find more details and some use cases on the Movigo [website](https://movigo.cedoor.dev)
and in Ceditor [gists](https://ceditor.cedoor.dev/40d7fcbb1d31d30fa9932bfcdeff91cd/movigo.js).

________________________________

## :paperclip: Table of Contents
- :hammer: [Install](#hammer-install)
- :chart_with_upwards_trend: [Development](#chart_with_upwards_trend-development)
  - :scroll: [Rules](#scroll-rules)
    - [Commits](#commits)
    - [Branches](#branches)
- :page_facing_up: [License](#page_facing_up-license)
- :telephone_receiver: [Contacts](#telephone_receiver-contacts)
  - :boy: [Developers](#boy-developers)

## :hammer: Install

### npm

You can install movigo package with npm:

    npm install @cedoor/movigo --save
    
### CDN

You can also load it using a \<script> using the unpkg CDN:
    
    <script src="https://unpkg.com/@cedoor/movigo"></script>

## :chart_with_upwards_trend: Development

### :scroll: Rules

#### Commits

* Use this commit message format (angular style):  

    `[<type>] <subject>`
    `<BLANK LINE>`
    `<body>`

    where `type` must be one of the following:

    - feat: A new feature
    - fix: A bug fix
    - docs: Documentation only changes
    - style: Changes that do not affect the meaning of the code
    - refactor: A code change that neither fixes a bug nor adds a feature
    - test: Adding missing or correcting existing tests
    - chore: Changes to the build process or auxiliary tools and libraries such as documentation generation
    - update: Update of the library version or of the dependencies

and `body` must be should include the motivation for the change and contrast this with previous behavior (do not add body if the commit is trivial). 

* Use the imperative, present tense: "change" not "changed" nor "changes".
* Don't capitalize first letter.
* No dot (.) at the end.

#### Branches

* There is a master branch, used only for release.
* There is a dev branch, used to merge all sub dev branch.
* Avoid long descriptive names for long-lived branches.
* No CamelCase.
* Use grouping tokens (words) at the beginning of your branch names (in a similar way to the `type` of commit).
* Define and use short lead tokens to differentiate branches in a way that is meaningful to your workflow.
* Use slashes to separate parts of your branch names.
* Remove branch after merge if it is not important.

Examples:
    
    git branch -b docs/README
    git branch -b test/one-function
    git branch -b feat/side-bar
    git branch -b style/header

## :page_facing_up: License
* See [LICENSE](https://github.com/cedoor/movigo/blob/master/LICENSE) file.

## :telephone_receiver: Contacts
### :boy: Developers

#### Cedoor
* E-mail : me@cedoor.dev
* Github : [@cedoor](https://github.com/cedoor)
* Website : https://cedoor.dev
