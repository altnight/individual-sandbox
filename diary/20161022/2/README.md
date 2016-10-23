## jQuery でデータを参照してDOMを書き換えるようにする話

- React ならデータを書き換えると自動的に変更される
- jQuery で実装するとどうなるかという話
- (マークアップは雑だけど)結果としては実装できた
  - `serialize` `deserialize` という命名でよいのか
    - `to_dom` `to_data` くらいでよかったのでは
  - 名前空間をわけるのってこれでよかったんだろうか
  - `serialize` ではnodeを返しているのに `deserialize` では ns.data にデータいれているのはどうなのか
  - refresh を呼ぶのではなく observer 的なものをつくれたらいいんじゃないか
