AutoForm.addInputType("bootstrap-postthumbnail", {
  template: "afPostThumbnail"
});

Template.afPostThumbnail.helpers({
  atts: function addFormControlAtts() {
    var atts = _.clone(this.atts);
    // Add bootstrap class
    atts = AutoForm.Utility.addClass(atts, "form-control");
    return atts;
  },
  style: function () {
    var thumbnailWidth = getSetting('thumbnailWidth', 200);
    var thumbnailHeight = getSetting('thumbnailHeight', 125);
    return "width: "+thumbnailWidth+"px; height: "+thumbnailHeight+"px;"
  }
});

Template.afPostThumbnail.rendered = function () {

  var $img = this.$('.post-thumbnail-preview');
  var $thumbnailUrlField = this.$('[name="thumbnailUrl"]');

  // note: the following fields are *not* in the current template
  var $urlField = $('[name="url"]');
  var $titleField = $('[name="title"]');
  var $bodyField = $('[name="body"]');
  var $thumbnailContainer = $('.post-thumbnail-container');


  $urlField.change(function (e) {
    var url = $urlField.val();
    if (!!url) {
      $thumbnailContainer.addClass('loading');
      clearSeenErrors();
      console.log('getting embedly data for '+url);
      Meteor.call('getEmbedlyData', url, function (error, data) {
        if (error) {
          console.log(error)
          throwError(error.reason);
          $thumbnailContainer.removeClass('loading');
          return
        }
        if (data) {
          $img.attr('src', data.thumbnailUrl);
          $thumbnailUrlField.val(data.thumbnailUrl);
          $titleField.val(data.title);
          $bodyField.val(data.description);
          $thumbnailContainer.removeClass('loading');
        }
      });
    }
  });
}

