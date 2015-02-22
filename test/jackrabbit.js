var chai = require('chai').should();
var java = require('java');
var path = require('path');
var recursive = require('recursive-readdir');

describe('Jackrabbit oak test', function(){


  before(function(done){

      var java = require('java');
      var classPath = './java/lib';
      var mvn = require('node-java-maven');

      recursive(classPath, function (err, files) {
        files.forEach(function(file){
          var newPath = '.' + '/' + file;
          console.log('Registering....', path.resolve(newPath));
          java.classpath.push(newPath);
        });
        done();

      });

  });

  it('Should connect to jackrabbit', function(done){

    var MongoClientURI = java.import('com.mongodb.MongoClientURI');
    var MongoConnection = java.import('org.apache.jackrabbit.oak.plugins.document.util.MongoConnection');
    var NodeStore = java.import('org.apache.jackrabbit.oak.spi.state.NodeStore');
    var DocumentMK = java.import('org.apache.jackrabbit.oak.plugins.document.DocumentMK');
    var Oak = java.import('org.apache.jackrabbit.oak.Oak');
    var ContentRepository = java.import('org.apache.jackrabbit.oak.api.ContentRepository');
    var Builder = DocumentMK.Builder;

    var InitialContent= java.import('org.apache.jackrabbit.oak.plugins.nodetype.write.InitialContent');
    var NameValidatorProvider= java.import('org.apache.jackrabbit.oak.plugins.name.NameValidatorProvider');
    var SecurityProviderImpl = java.import('org.apache.jackrabbit.oak.security.SecurityProviderImpl');
    var DefaultEditor = java.import('org.apache.jackrabbit.oak.spi.commit.DefaultEditor');
    var PropertyIndexProvider = java.import('org.apache.jackrabbit.oak.plugins.index.property.PropertyIndexProvider');


    var uri = "mongodb://localhost/nodetest";
    var uri = new MongoClientURI(uri);
    var mongo;
    mongo = new MongoConnection(uri.getURISync());
    var nodeStore = new Builder()
                        .setMongoDBSync(mongo.getDBSync())
                        .getNodeStoreSync();
    var repository =new Oak(nodeStore)                    
                        .withSync(new DefaultEditor())     // automatically set default types
                        .withSync(new NameValidatorProvider()) // allow only valid JCR names
                        .withSync(new SecurityProviderImpl())  // use the default security
                        .withSync(new PropertyIndexProvider()) // search support for the indexes
                        .createContentRepositorySync();



    done();

  });



});
