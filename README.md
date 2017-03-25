# Au Template frontend workflow

### Sau khi clone

```
npm install
bower install
```

## Folder struct
+ app
    - fonts
        - all fonts
    - images
        - icons
        - backgrounds
        - ____layouts
    - layouts
        - layout mixins
        - general
            - layout.pug (Page frame)
    - scripts
        - all file your js
    - scss
        - general
        - components
        - layouts
        - main.scss
    - vendor
        - all your pluins
    - index.pug
+ dist
    - css
        - main.css
        - main.min.css
    - js
        - all js in app/vendor/scripts
    - fonts
        - all fonts in app/vendor/fonts
    - img
        - all images in app/images
    - vendor
        - all pluins in bower and app/vendor
    - indext.html
        
## Start a business task

###### Open gulpfile.js write page task in 

```javascript
const page = ['index'];
```

```
gulp dev
```

## Tutorial

- Giai đoạn 1
    - Viết tất cả các element chung cho theme
- Giai đoạn 2
    - Viết các layout cho theme vào từng folder trong app/layouts
        - Tạo một mixins duy nhất để +layout vào các page
- Giai đoạn 3
    - Review lại các page
    
- Cài thêm thư viện
    - bower install name --save-dev
    
- Trong app/layouts/general/layout.pug là một layouts chung cho các page

    ```
    include ../footer/footer
    doctype html
    html
        head
            block head
                meta(charset='UTF-8')
                block title
                meta(name='description', content='Au theme template')
                meta(name='keywords', content='Au theme template')
                meta(name="viewport", content="width=device-width, initial-scale=1")
                //
                    Loads base pluins
    
                // Styles
                link(href='vendor/bootstrap/dist/css/bootstrap.min.css', rel='stylesheet')
                block style
                link(href='css/main.css', rel='stylesheet')
    
                // Javascript
                script(src='vendor/jquery/dist/jquery.min.js')
                script(src='vendor/bootstrap/dist/js/bootstrap.min.js')
                block script
        body
            block page
    
        +footer 
    ```
    
    - Trong này sẽ quy định một số cái mà page nào cũng có vd jquery, bootstrap, main.css
- Khi viết các trang ví dụ trang index sẽ làm như sau

    ```
    extends layouts/general/layout
    include layouts/footer/footer
    include layouts/footer/header
    
    append title
        title Homepage 1
    append script
        script(src='/vendor/three.js')
    append style
        link(href='/vendor/three.css', rel='stylesheet')
    
    block content
        +header
        +footer
    ```
    - Từng page riêng sẽ được chúng ta định nghĩa thêm một số cái như title js, css của các thư viện khác chỉ dùng cho page này thôi!
    - Phần block content là toàn bộ layout mà chúng ta sẽ + vào!
- Cuối cùng sẽ ra được một trang index.html như thế này

    ```html
    
    
    <!DOCTYPE html>
    <html>
    
    <head>
        <meta charset="UTF-8">
        <title>Homepage 1</title>
        <meta name="description" content="Au theme template">
        <meta name="keywords" content="Au theme template">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <!--
        Loads base pluins
        
        -->
        <!-- Styles-->
        <link href="vendor/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
        <link href="css/main.css" rel="stylesheet">
        <link href="/vendor/three.css" rel="stylesheet">
        <!-- Javascript-->
        <script src="vendor/jquery/dist/jquery.min.js"></script>
        <script src="vendor/bootstrap/dist/js/bootstrap.min.js"></script>
        <script src="/vendor/three.js"></script>
    </head>
    
    <body>
        <header>header</header>
        <footer>footer</footer>
    </body>
    
    </html>
    ```

- Các trang khác làm tương tự

- Điểm cải tiến
    - Không phải tra head cho từng page trong json nữa tránh mỏi mắt, với dễ gặp error
    - Có thể comments tùy ý cho từng phần của các head
    
- Note
    - Khi chạy gulp dev sẽ tự movelib không cần gõ gulp movelib nữa
    - gulp dev sẽ chạy lần lượt các task
    
        ```
        'clean', 'movelib', 'scss', 'fonts', 'scripts', 'images', 'html'
        ```
        
    - Khi chạy gulp production
    
        ```
        'clean', 'movelib', 'scss', 'scss-min', 'fonts', 'scripts', 'image-min', 'html'
        ```
        
    - (Giống dev nhưng sẽ có cssmin jsmin nén ảnh và ko watch server sản phẩm sẽ nằm trong folder dist)