## card app

### データを別ファイルにする

- JSON にしたかったけどうまく読み込めなかった
- 参考: http://stackoverflow.com/questions/31758081/loading-json-data-from-local-file-into-react-js#answer-33141549

###

- list -> card -> comment とフォームのネストを深くしてみた
- `CommentForm` は親まで辿らせる必要がでてきていて、これで正しいか自信ない

  - react 的に使いやすい文法がある or そもそもやろうとしていることがいまいち or そういうもの
  - データ構造として自前でjoinするような構造にしているのが面倒
