<template>
  <div class="modal fade" tabindex="-1" id="SyntaxGuide">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Syntax Guide</h5>
          <button ref="btnCloseModal" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body small" style="max-height: calc(100vh - 85px);overflow-y: auto;">
          <table class="table table-bordered article">
          <tbody>
            <tr>
              <td>## Heading</td>
              <td><h2 class="h4 my-0">Heading</h2></td>
            </tr>
            <tr>
              <td>### Subheading</td>
              <td><h3 class="h5 my-0">Subheading</h3></td>
            </tr>
            <tr>
              <td>_Italic_</td>
              <td><em>Italic</em></td>
            </tr>
            <tr>
              <td>**Bold**</td>
              <td><strong>Bold</strong></td>
            </tr>
            <tr>
              <td>~~Deleted~~</td>
              <td><s>Deleted</s></td>
            </tr>
            <tr>
              <td>[Link](https://www.google.com)</td>
              <td><a href="#">Link</a></td>
            </tr>
            <tr>
              <td>![image](https://picsum.photos/200)</td>
              <td><img src="https://picsum.photos/200" width="64"></td>
            </tr>
            <tr>
              <td>> Blockquote</td>
              <td><blockquote class="mb-0">Blockquote</blockquote></td>
            </tr>
            <tr>
              <td>---</td>
              <td><hr /></td>
            </tr>
          </tbody>
        </table>
        </div>
      </div>
    </div>
  </div>
</template>