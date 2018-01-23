## pytest 実行時のデバッガの表示をリッチにしたい

最近 django のテスト実行を pytest(pytest-django使用) で行うようにしてるため。
結論としては、 ipdb を使ってる場合は `pytest -s` で実行するか、 pdbpp のような表示を拡張するライブラリを使って `pytest -pdb` したらよい。

自分の場合素の pdb だけだと心もとないので、デバッガは ipdb を使っている。標準の pdb に加えてタブでの名前補完や属性補完がほしいから。PyCharmのデバッガは設定が必要だし、デバッガを使いたいときはターミナルからvimを使ってることも多いのでIDEの機能でないほうが都合がいい。

ただ、 pytest を実行したときに `--pdb` を指定してもデバッガが起動してくれなかった。pytest-ipdb というプラグインもあるようだけど、標準の pdb を拡張してくれる pdbpp というプラグインを使うことにした。補完が効くし充分。

ただこれを書いてて気がついたのだけれど、StackOverFlowの回答で「`-s`をつければいいよ」と回答されていた。ということで、しばらく気が向いた方を使おうと思う。

リポジトリにそれぞれのパターンで実行できるMakefileを用意した。`make pdbpp` あるいは `make ipdb` で確認できる。

## 参考

* https://stackoverflow.com/questions/16022915/how-to-execute-ipdb-set-trace-at-will-while-running-pytest-tests
* https://github.com/mverteuil/pytest-ipdb
* https://pypi.python.org/pypi/pdbpp/
