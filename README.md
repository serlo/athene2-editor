Athene2 Editor
==============

You'll need [NodeJS](http://nodejs.org) and Ruby installed. Also make sure that bower and grunt are installed:

```
npm install bower -g
npm install grunt-cli -g
gem update --system
gem install compass
gem install sass
```

Now, install the packages needed by the Editor:

```
npm install
bower install
grunt dev
```

Finally, open the Editor by opening the `index.html` in your browser (served by a webserver like apache2).
