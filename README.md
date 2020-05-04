<p align="center">
    <h1 align="center">
        <img width="40" src="https://raw.githubusercontent.com/movigo/core/master/resources/icon.png">
        Movigo
    </h1>
    <p align="center">Movigo library core with base features to animate your DOM elements.</p>
</p>
    
<p align="center">
    <a href="https://github.com/movigo/core/blob/master/LICENSE" target="_blank">
        <img src="https://img.shields.io/github/license/movigo/core.svg?style=flat-square">
    </a>
    <a href="https://david-dm.org/movigo/core?type=dev" target="_blank">
        <img src="https://img.shields.io/david/dev/movigo/core.svg?style=flat-square">
    </a>
    <a href='https://movigo.readthedocs.io/en/latest/?badge=latest'>
        <img src='https://readthedocs.org/projects/movigo/badge/?version=latest' alt='Documentation Status' />
    </a>
</p>

Movigo is a light and modern JS animation library which makes the creation of DOM element animations easier.
Movigo use new ECMAScript features and the so-called method chaining technique, and save the state of the animation in each function.
This means that you can break the chain and create new chains with additional functions by building different animations.

Library functions allow you to change CSS property values to animate or to set some animation options.
It is also possible to extend the library with a plugin system that allows you to add functions.

You can find some use cases on [https://movigo.cedoor.dev](https://movigo.cedoor.dev) and
documentation on [http://movigo.rtfd.io/](http://movigo.rtfd.io/).

________________________________

## :paperclip: Table of Contents
- :chart_with_upwards_trend: [Development](#chart_with_upwards_trend-development)
  - :scroll: [Rules](#scroll-rules)
    - [Commits](#commits)
    - [Branches](#branches)
- :page_facing_up: [License](#page_facing_up-license)
- :telephone_receiver: [Contacts](#telephone_receiver-contacts)
  - :boy: [Developers](#boy-developers)

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
* See [LICENSE](https://github.com/movigo/core/blob/master/LICENSE) file.

## :telephone_receiver: Contacts
### :boy: Developers

#### Cedoor
* E-mail : me@cedoor.dev
* Github : [@cedoor](https://github.com/cedoor)
* Website : https://cedoor.dev
