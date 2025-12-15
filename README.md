```
yarn create react-app old-local-blog --template typescript
cd old-local-blog

yarn add @reduxjs/toolkit@1.8.6 react-redux@8.0.4

yarn add -D tailwindcss@3.1.8 postcss@8.4.18 autoprefixer@10.4.12

yarn tailwindcss init -p
```

# RTK query

## RTK query là gì?

RTK query là thư viện thuộc hệ sinh thái Redux giúp chúng ta quản lý việc gọi API và caching dễ dàng.

### Lý do RTK query xuất hiện

Giúp chúng ta hạn chế những việc lặp đi lặp lại trong quá trình fetch data.

Để fetch data trong React

- Khai báo useEffect và gọi API trong đó
- Xử lý cleanup function để tránh việc gọi duplicate data
- Tracking trạng thái loading để hiển thị skeleton
- Quản lý thời gian cache khi user tương tác với UI

Những việc này không khó, nhưng nó nhiều, nếu nhiều component cần implement cái này thì khá mệt. Nếu dùng với Redux thì mệt hơn nữa khi mỗi lần gọi API phải khai báo action, thunk các kiểu. Ngay cả khi khi chúng ta sử dụng `createAsyncThunk` cùng với `createSlice` thì vẫn còn những hạn chế khi chúng ta phải tự quản lý state loading hay tránh gọi duplicate request.

Những năm gần đây, cộng đồng React nhận ra rằng **fetch data và caching cũng là một nỗi lo khác cùng với việc quản lý state**.

RTK Query lấy cảm hứng từ những thư viện như Apollo Client, React Query, Urql và SWR nhưng được build trên Redux Toolkit

// Nếu bên slice chúng ta dùng createSlice để tạo slice thì bên RTK query dùng createApi
// Với createApi chúng ta gọi là slice api
// Chúng ta sẽ khai báo baseUrl và các endpoints

// baseQuery được dùng cho mỗi endpoint để fetch api

// fetchBaseQuery là một function nhỏ được xây dựng trên fetch API
// Nó không thay thế hoàn toàn được Axios nhưng sẽ giải quyết được hầu hết các vấn đề của bạn
// Chúng ta có thể dùng axios thay thế cũng được, nhưng để sau nhé

// endPoints là tập hợp những method giúp get, post, put, delete... tương tác với server
// Khi khai báo endPoints nó sẽ sinh ra cho chúng ta các hook tương ứng để dùng trong component
// endpoints có 2 kiểu là query và mutation.
// Query: Thường dùng cho GET
// Mutation: Thường dùng cho các trường hợp thay đổi dữ liệu trên server như POST, PUT, DELETE

// Có thể ban đầu mọi người thấy nó phức tạp và khó hiểu
// Không sao, mình cũng thể, các bạn chỉ cần hiểu là đây là cách setup mà RTK query yêu cầu
// Chúng ta chỉ cần làm theo hướng dẫn là được

/**
 * Mô hình sync dữ liệu danh sách bài post dưới local sau khi thêm 1 bài post
 * Thường sẽ có 2 cách tiếp cận
 * Cách 1: Đây là cách những video trước đây mình dùng
 * 1. Sau khi thêm 1 bài post thì server sẽ trả về data của bài post đó
 * 2. Chúng ta sẽ tiến hành lấy data đó thêm vào state redux
 * 3. Lúc này UI chúng ta sẽ được sync
 *
 * ====> Rủi ro cách này là nếu khi gọi request add post mà server trả về data không đủ các field để
 * chúng ta hiển thị thì sẽ gặp lỗi. Nếu có nhiều người cùng add post thì data sẽ sync thiếu,
 * Chưa kể chúng ta phải quản lý việc cập nhật state nữa, hơi mệt!
 *
 *
 * Cách 2: Đây là cách thường dùng với RTK query
 * 1. Sau khi thêm 1 bài post thì server sẽ trả về data của bài post đó
 * 2. Chúng ta sẽ tiến hành fetch lại API get posts để cập nhật state redux 
 * 3. Lúc này UI chúng ta sẽ được sync
 *
 * =====> Cách này giúp data dưới local sẽ luôn mới nhất, luôn đồng bộ với server
 * =====> Khuyết điểm là chúng ta sẽ tốn thêm một lần gọi API. Thực ra thì điều này có thể chấp nhận được
 */
