# Archidoxa

Astroテンプレート

## Init

- `src/config/site.ts`
  - サイト名
  - サイト説明
  - light/dark テーマ
  - About に表示する SNS アカウント
- `src/config/content_sections.ts`
  - 記事カテゴリ
  - 一覧での表示名
  - 1ページあたりの記事数
  - 一覧レイアウト
- `src/content/sample/`
  - サンプル記事
  - 記事用画像
- `src/pages/about.astro`
  - About ページ本文

## Config

`src/config/site.ts`でサイト全体の表示を設定します

```ts
export const site_config = {
  title: 'Archidoxa',
  description: 'Markdown-first static content site foundation.',
  theme: 'dark',
  social: {
    enabled: true,
    items: [
      {
        label: 'GitHub',
        href: 'https://github.com/',
        handle: '@archidoxa',
      },
    ],
  },
};
```

`theme`は`light`または`dark`を指定します \
SNS表示を使わない場合は,`social.enabled`を`false`にします

## Category

記事カテゴリは`src/config/content_sections.ts`で設定 \
初期状態では`sample`だけを利用 \
自分のカテゴリを作る場合は, `src/content/<カテゴリ名>/`を作成して同じ名前を`content_sections`に追加します

```ts
{
  name: 'sample',
  display_name: 'Sample',
  visible: true,
  order: 10,
  page_size: 20,
  list_layout: 'card',
  description: 'Initial sample content section.',
}
```

`name`はディレクトリ名です, 存在しないカテゴリを設定した場合そのカテゴリは無視されます \
Markdown frontmatterにカテゴリ名を書く必要はありません \
`All`は全記事を見るための固定ページ, その他のカテゴリは設定と記事ディレクトリから表示

## Write

記事は`src/content/sample/`のMarkdownファイルを参考に追加します

```md
---
title: "記事タイトル"
description: "一覧と検索に使う短い説明"
pub_date: "2026-08-03"
status: "public"
entry_layout: "article"
tags:
  - sample
  - markdown
---

本文を書きます
```

よく変更する項目は次の通りです。

- `title`: 記事タイトル
- `description`: 一覧, 検索, カード hover表示に使う説明
- `pub_date`: 公開日 表示形式は `yyyy/MM/dd`
- `updated_date`: 更新日を出したい場合に指定
- `status`: `public` / `draft` / `hidden`
- `entry_layout`: `article` / `memo`
- `tags`: 検索やタグクリックに使うタグ
- `hero_image`: カードに表示する画像
- `hero_image_alt`: 画像の代替テキスト

`hero_image`を指定しない記事にはデフォルト画像が自動で割り当て

## Publish

`status` で記事の扱いを切り替えます。

- `public`: 公開対象
- `draft`: 下書き, 検証はされますが公開一覧には非表示
- `hidden`: 非表示, 内部メモや確認用

`pub_date`が未来の日付の記事も公開日までは非表示

## List and Search

一覧ページでは, タイトル, 説明, タグが検索対象 本文全文検索は対象外 \
通常の検索では, 表示中カテゴリ配下の記事を検索します

`All` では全カテゴリから検索します \
タグだけを検索したい場合は, 検索欄に`#tag`のように入力します, カード上のタグをクリックでも`All`のタグ検索に移動します

## Popup and Side Notes

記事中にpopupリンクを置くと, 補足コードや短い参照をその場で表示できます

```md
[ls の説明](popup:bash#command.ls)
```

同じ記事内にpopup定義を書きます

````md
<!-- @popup bash#command.ls title="List directory contents" -->

```bash
ls # list directory contents
```
````

`title` は省略できます

ID は`bash#command.ls`のように, `言語#分類.名前`までを想定 \
さらに深い`bash#command.ls.la`のような階層は使用不可

コメントを消して表示したい場合は、リンクにオプションを付けます。

```md
[コメントなし](popup:bash#command.ls?nocomment)
[popup だけコメントなし](popup:bash#command.ls?popup_nocomment)
[サイドノートだけコメントなし](popup:bash#command.ls?side_nocomment)
```

popup はサイドノートに送ることができます \
サイドノートはページ移動後も維持され, ピン留め済みのものを再クリックすると解除されます

## About and SNS

About ページは`src/pages/about.astro`を編集します \
SNS表示は`src/config/site.ts`の`social`で設定します

表示しない場合:

```ts
social: {
  enabled: false,
  items: [],
}
```

表示する場合:

```ts
social: {
  enabled: true,
  items: [
    {
      label: 'GitHub',
      href: 'https://github.com/example',
      handle: '@example',
    },
  ],
}
```

## Sample Content

`src/content/sample/` には表示確認用の記事が入っています

- 通常記事
- 短い memo
- 長文記事
- 長いタイトルの記事
- 画像ありの記事
- デフォルト画像の記事
- popup が多い記事
- draft / hidden / future-dated の状態確認記事

## Commands

記事を追加/変更した後は次のコマンドで確認

```bash
npm run content:check
npm test
npm run build
```

ローカルで表示を確認する場合:

```bash
npm run dev
```
