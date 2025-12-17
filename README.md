```
yarn create react-app old-local-blog --template typescript
cd old-local-blog

yarn add @reduxjs/toolkit@1.8.6 react-redux@8.0.4

yarn add -D tailwindcss@3.1.8 postcss@8.4.18 autoprefixer@10.4.12

yarn tailwindcss init -p

yarn add react-toastify
```


Luồng đi handle lỗi, khi bấm edit thì dispatch tới action trong blog.slice.ts đây set lại state, handle lỗi trong create, xem đang thuộc lỗi của update hay add hiển thị cho đúng 

2 ông này lấy từ use...Mutattion của ông createApi import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

ông này quăng đúng 3 lỗi serial | fetch | undefined

đối với kiểm soát trong jsonserver thì hiển thị form lỗi
còn đối với code logic quăng lỗi thì yarn add toast ha , rồi