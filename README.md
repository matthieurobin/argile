# argile
Convert SQL rows to js object(s).

## Installation 
```bash
npm install --save argile
```

## How does it work ?

### Database
![capture](https://cloud.githubusercontent.com/assets/5453156/21740761/4c27a890-d4c3-11e6-9cf8-c907786ceb82.PNG)

The figure above pesents a simple database. We want to retrieve all the posts.

### SQL request

The following request returns all the data in the database.

```SQL
  SELECT
    post.id,
    post.title,
    author.username,
    tag.id AS "idTag",
    tag.label
  FROM post
  INNER JOIN author ON author.id = post.author_id
  LEFT JOIN post_tag ON post_tag.post_id = post.id
  LEFT JOIN tag ON tag.id = post_tag.tag_id
  ORDER BY post.id, tag.label
``` 

### Construct the JS result

Now, to convert the SQL result to JS objects, we design an object that will be the returned result.  
Here, we want to construct by post, an array of tags and an user object.

A string represents the SQL key that will match the correponding return js object property.  
The `*` character tags the SQL string as a primary key. It is **imperative** to define a primary key for sub arrays.

```javascript
  {
    id    : 'id',
    title : 'title',
    author : {
      username : 'username'
    },
    tags : [{
      id    : '*idTag',
      label : 'label'
    }]
  }
```

### Conversion

```javascript
  var argile = require('argile');

  var res = argile.convert(SQLrows, {
    id    : 'id',
    title : 'title',
    author : {
      username : 'username'
    },
    tags : [{
      id    : 'idTag',
      label : 'label'
    }]
  });
```

We assume `SQLrows` is an array of JS objects constructed from the SQL request.  

The conversion keeps the SQL order defined in the SQL request.

## API

The module has only one function `argile.convert(SQLrows, constructedResult)`.
- `{Array} SQLrows`
- `{Object} constructedResult`

It returns an `Array`