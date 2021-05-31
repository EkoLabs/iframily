// MY TODO: check readme renders nicely in npm and github (initParent/Child api is longer line...)
  "version": "1.0.0-temp.1",
  npm publish --tag temp

// MY TODO: targetOrigin regex not allowed both because it also controls the postMessage() and to avoid "dot" unescaping mistakes

// TODO: icon
<img src="https://eko.engineering/static/media/sonorous_logo.83f6c44b.svg" alt="Sonorous" width="200"/>

# Iframily - postMessage made simple & safe

Iframily simplifies working and establishing communication between frames.

It provides a simpler API than [postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage), which includes Promise-based responses, message queuing, and holding on to messages until both frames are ready to talk.

This is how it works:

1. Create iframilies in the parent and child frame.
2. If a parent id and child id match, they will pair.
3. Send messages between paired iframilies.

By the team from [<img src="https://user-images.githubusercontent.com/3951311/86791993-b4c78200-c072-11ea-8936-14db378904a3.png" valign="bottom" width=200 alt="eko Engineering">](https://eko.engineering)

// TODO: replace images source?

**With vanilla postMessage:**

![postMessage](https://s3.amazonaws.com/storage2.interlude.fm/dev_temp/asaf/iframily/images/new/postmessage.png)

**With Iframily:**

![Iframily](https://s3.amazonaws.com/storage2.interlude.fm/dev_temp/asaf/iframily/images/new/iframily.png)

## Table of Contents

* [Features](#features)
* [Examples](#examples)
* [Installation](#installation)
* [API](#api)
  * [Iframily singleton](#----iframily-singleton----)
  * [iframily instance](#----iframily-instance----)
* [Notes](#notes)
* [Contributing](#contributing)

## Features

### What makes it special

Iframily pushes you to be more responsible with your frame security by keeping it front and center. You'll need to explicitly specify the allowed origin for communication and the sender's origin for verification, both on the parent and child frames. See more on [initParent() / initChild() API](#----iframily-singleton----).

### What makes it awesome

* Enforces security best practices: Iframily prevents you from accidentally setting too permissive configuration, making you less vulnerable to exploits.
* Long-lived two-way communication between frames. While other libraries treat messages separately, Iframily enables you to easily respond to incoming messages and maintain the communication chain, keeping track of messages and their responses to allow for more complex communications.
* Each frame connection is named and identified, allowing for continuous communication even when a frame redirects or reloads.
* Fast and intuitive promise-based API (supports async responses).
* Discrete handlers can be defined for specific frames or modules in frames, allowing true separation of concerns and code between the different frames and their uses.
* Unlike other libraries, you don’t need to change how you initialize your iframes. Iframily works out of the box with any iframe. Just give it a frame identifier and let it do its thing.
* Message queue until paring completed so messages don’t get lost, even if a frame page hasn’t completed loading yet.
* Zero dependencies.
* Unit + battle tested

// TODO: real codepen links + images
## Examples

[Invasion of the frame snatchers](https://codepen.io/OpherV/pen/xxwRMBw?editors=0100)

Demonstrates a simple usage of Iframily to communicate between a parent and child frame through an interactive, sweet father-son dialogue about world domination.

[<img src="https://user-images.githubusercontent.com/3951311/81201022-71e32280-8fcd-11ea-9b9d-6adcf7fa6394.png" width=400>](https://codepen.io/OpherV/pen/xxwRMBw?editors=0100)

[Text Chat Madness](https://codepen.io/OpherV/pen/PoPQwaz?editors=0010)

Demonstrates usage of Iframily to communicate between a parent frame and multiple child frames through interactive conversations in a family of five. How will mom handle all these questions? You decide!

[<img src="https://user-images.githubusercontent.com/3951311/81200872-3ba5a300-8fcd-11ea-90cf-7de98cacfaf8.png" width=400>](https://codepen.io/OpherV/pen/PoPQwaz?editors=0010)

[Crazy Tetris](https://codepen.io/OpherV/pen/QWjQbmZ?editors=1100)

A novel (and somewhat strange) reimplementation of the classic Tetris using Iframily! Each frame runs its own self-contained Tetris instance. The twist? Instead of moving the pieces, the player moves the frames themselves to align the pieces and allow them to flow freely between frames.

[<img src="https://user-images.githubusercontent.com/3951311/86790421-14249280-c071-11ea-91fd-1fe57bb357e7.png" width=400>](https://codepen.io/OpherV/pen/QWjQbmZ?editors=1100)

See the repo's `examples/` directory for the source code.

## Installation

```shell
npm i @ekolabs/iframily --save
```

**ES6**
```javascript
import Iframily from '@ekolabs/iframily';
```
**CommonJS**
```javascript
const Iframily = require('@ekolabs/iframily');
```

You can also add the library via script tag and use `window.Iframily`, like so:

```html
<!-- latest -->
<script src="https://unpkg.com/@ekolabs/iframily"></script>

<!-- specific version (for example: 1.0.0) -->
<script src="https://unpkg.com/@ekolabs/iframily@1.0.0"></script>
```

## API

### --- Iframily singleton ---

Iframily is a singleton and will allow you to initialize parent/child [iframily instances](#----iframily-instance----).

#### `Iframily.initParent(id, targetOrigin, msgHandler, options) -> iframily instance`

#### `Iframily.initChild(id, targetOrigin, msgHandler, options) -> iframily instance`

Creates a parent/child [iframily instance](#----iframily-instance----) respectively (to be used in the parent/child frame) and returns it, if successful.

| Param           | Type           | Description  |
| :-------------: |:--------------:| :------------|
| id | `string` | A unique id to identify this [iframily instance](#----iframily-instance----), this is used in order to match parent and child iframilies. Will abort and log an error if the id already exists in the current frame. |
| targetOrigin | `string` | The URI to use as the target origin for the `postMessage` call and for validating the sender origin on incoming messages, for example: `https://subdomain.domain.com`. For security concerns this argument is mandatory, see [link](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) for more info. If both frames our on the same origin, you can use `window.location.origin` as the value. Passing `"*"` (wildcard) is not supported, if you are 100% certain that you want to allow messages to be received and handled by everyone, you can pass `"DANGEROUSLY_SET_WILDCARD"` instead. |
| msgHandler | `function` | Optional - A handler for incoming messages from the paired iframily in the parent/child frame. The `msgHandler` can return back a response value or a promise that will be resolved/rejected with a response value. |
| options | `object` | Optional - Additional options, see possible options below: |
| options.onPairedHandler | `function` | Optional - A handler that will be invoked upon pairing. |
| options.onDisposedHandler | `function` | Optional - A handler that will be invoked when the instance is disposed. |

#### `Iframily.isIframilyMessage(event) -> boolean`

If you manually listen to messages using the window ["message" event](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage#The_dispatched_event) you will also receive internal iframily messages. This method will return `true` for this events so you can easily identify them.

```javascript
window.addEventListener('message', receiveMessage);

function receiveMessage(event) {
    // Ignore iframily messages.
    if (Iframily.isIframilyMessage(event)) {
        return;
    }

    // Handle other messages below:
    // ...
}
```

### --- iframily instance ---

The iframily instance is the object returned when initializing a new iframily using the `initParent()` or `initChild()` methods.

#### `f.sendMessage(msg) -> Promise`

| Param           | Type           | Description  |
| :-------------: |:--------------:| :------------|
| msg             | `serializable` | The message to be sent, can be any serializable data (see [structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)).

Returns a promise that will be resolved with the response value from the receiving iframily instance message handler. The promise will be rejected if the promised returned by the receiving iframily instance rejects.

> if the receiving iframily instance did not return an explicit response value in its message handler, the promise will be resolved with `undefined`.

#### `f.dispose()`

Dispose of the iframily instance, making it obsolete.

> * You cannot reuse a disposed instance, you can however create a new instance with the same id.
> * Any iframilies paired with this instance will still be able to keep sending messages to the disposed instance but the messages will be ignored by the disposed target.

This method is useful when you have a parent frame which recreates the same child frame and you want to use the same id for the iframilies.

#### `f.isDisposed -> boolean (read only)`

Returns `true` if this iframily instance has been disposed.

#### `f.id -> string (read only)`

Returns the id that this iframily was initialized with.

## Usage example

```javascript
// -------------------------
// In the parent frame.
// -------------------------
const Iframily = require('@ekolabs/iframily');

let msgHandler = function(msg) {
    console.log('parent got message:', msg);
};

let iframilyParent = Iframily.initParent('myUniqueId', window.location.origin, msgHandler);

iframilyParent.sendMessage('do something')
    .then((response) => {
        console.log('parent got response:', response);
    });

iframilyParent.sendMessage('do something async')
    .then((response) => {
        console.log('parent got async response:', response);
    });
```

```javascript
// -------------------------
// In the child frame.
// -------------------------
const Iframily = require('@ekolabs/iframily');

let msgHandler = function(msg) {
    console.log('child got message:', msg);

    if (msg === 'do something') {
        return 'OK! done!';
    } else if (msg === 'do something async') {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('OK! done async!');
            }, 1000);
        });
    }
};

let iframilyChild = Iframily.initChild('myUniqueId', window.location.origin, msgHandler);

iframilyChild.sendMessage({ text: 'fancy' });
```

* Your unique id (`myUniqueId` in the example) should match between parent and child.

## Notes

* You can create multiple iframilies in each frame but the unique ids cannot be used more than once per frame (unless the previous one has been disposed).
* Parent can pair with one child only and vice versa (due to previous note).
* Designed for modern browsers (IE not supported).

## Contributing

* `npm run dev` - builds unuglified bundle and watches for changes.
* `npm run playground` - launch a simple page with a parent and child frame iframilies to manually test out stuff.
* Please make all pull requests against the `develop` branch.
* Please update/add tests coverage.
* Pay attention to linting (they will fail the production bundle build).
* `npm run test` - run tests.
  * `npm run test-debug-mac` or `npm run test-debug-win` for debugging the tests.
  * Tests run against the built bundle, so make sure your changes are built before running.
  * Tests require a modification in your hosts file (see note below).

Running tests require `node >=10` and modifying your hosts file like so:

```text
# iframily
127.0.0.1   sub1.domain1iframily.com
127.0.0.1   sub2.domain2iframily.com
```

When your done developing, make sure to run the production build via `npm run build` so the correct bundle will be committed to the `dist` folder.
