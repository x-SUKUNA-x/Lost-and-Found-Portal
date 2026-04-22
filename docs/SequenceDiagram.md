# 🔄 Sequence Diagrams — FoundIt Portal

## Overview

Sequence diagrams illustrate the interaction between system components over time for each major use case. They show the flow of messages between the **User (Browser)**, **Frontend (React)**, **Backend (Express API)**, **Auth Middleware**, and **Database (Supabase)**.

---

## 1. User Registration Flow

```mermaid
sequenceDiagram
    actor U as User
    participant FE as Frontend<br/>(React + Axios)
    participant BE as Backend<br/>(Express API)
    participant AS as Auth Service
    participant SB as Supabase Auth
    participant DB as Supabase DB<br/>(PostgreSQL)

    U->>FE: Fill registration form<br/>(name, email, password)
    FE->>FE: Validate input fields
    FE->>BE: POST /api/auth/register<br/>{name, email, password}
    BE->>AS: registerUser(name, email, password)
    AS->>AS: Validate inputs<br/>(non-empty, password ≥ 6 chars)
    AS->>SB: supabase.auth.signUp({email, password})
    SB-->>DB: INSERT INTO auth.users
    DB-->>DB: TRIGGER: on_auth_user_created<br/>→ INSERT INTO public.users
    SB-->>AS: {user, session}
    AS->>DB: UPDATE users SET name WHERE id
    DB-->>AS: ✅ Updated
    AS-->>BE: {user: {id, name, email}, token}
    BE-->>FE: 201 Created<br/>{success: true, data: {user, token}}
    FE->>FE: Store token in localStorage
    FE->>FE: Update AuthContext state
    FE-->>U: Redirect to Home page
```

---

## 2. User Login Flow

```mermaid
sequenceDiagram
    actor U as User
    participant FE as Frontend<br/>(React + Axios)
    participant BE as Backend<br/>(Express API)
    participant AS as Auth Service
    participant SB as Supabase Auth
    participant DB as Supabase DB

    U->>FE: Enter email & password
    FE->>BE: POST /api/auth/login<br/>{email, password}
    BE->>AS: loginUser(email, password)
    AS->>SB: supabase.auth.signInWithPassword()
    
    alt Invalid Credentials
        SB-->>AS: Error: Invalid login
        AS-->>BE: throw ApiError(401)
        BE-->>FE: 401 Unauthorized
        FE-->>U: Display "Invalid email or password"
    else Valid Credentials
        SB-->>AS: {user, session}
        AS->>DB: SELECT name FROM users WHERE id
        DB-->>AS: {name: "John Doe"}
        AS-->>BE: {user: {id, name, email}, token}
        BE-->>FE: 200 OK {success, data}
        FE->>FE: localStorage.setItem("token")
        FE->>FE: localStorage.setItem("user")
        FE->>FE: AuthContext.loginUser()
        FE-->>U: Redirect to Dashboard
    end
```

---

## 3. Report Lost/Found Item Flow

```mermaid
sequenceDiagram
    actor U as Authenticated User
    participant FE as Frontend<br/>(React)
    participant AX as Axios Interceptor
    participant BE as Backend API
    participant MW as Auth Middleware
    participant IS as Item Service
    participant DB as Supabase DB

    U->>FE: Fill "Post Item" form<br/>(title, description, category,<br/>status, location)
    FE->>AX: POST /api/items {payload}
    AX->>AX: Attach Authorization header<br/>Bearer <JWT token>
    AX->>BE: POST /api/items
    BE->>MW: authMiddleware(req)
    MW->>MW: Extract Bearer token
    MW->>DB: supabase.auth.getUser(token)
    
    alt Token Invalid/Expired
        DB-->>MW: Error
        MW-->>BE: throw ApiError(401)
        BE-->>FE: 401 Unauthorized
        FE->>FE: Clear localStorage
        FE-->>U: Redirect to Login
    else Token Valid
        DB-->>MW: {user: {id, email}}
        MW->>MW: req.user = {id, email}
        MW->>BE: next()
        BE->>IS: createItem(data, userId)
        IS->>DB: INSERT INTO items<br/>(title, description, category,<br/>status, location, user_id)
        DB-->>IS: {id, ...newItem}
        IS-->>BE: ApiResponse.created()
        BE-->>FE: 201 Created
        FE-->>U: "Item posted successfully!"<br/>Redirect to Home
    end
```

---

## 4. Submit Claim Flow

```mermaid
sequenceDiagram
    actor U as Claimer
    participant FE as Frontend
    participant BE as Backend API
    participant MW as Auth Middleware
    participant CS as Claim Service
    participant DB as Supabase DB
    actor O as Item Owner

    U->>FE: Click "Claim" on an item
    U->>FE: Enter claim message
    FE->>BE: POST /api/claims<br/>{item_id, message}
    BE->>MW: Verify JWT
    MW-->>BE: req.user = {id}
    BE->>CS: createClaim(data, userId)
    
    CS->>DB: SELECT * FROM items<br/>WHERE id = item_id
    
    alt Item Not Found
        DB-->>CS: null
        CS-->>BE: throw ApiError(404)
        BE-->>FE: 404 "Item not found"
    else Own Item
        DB-->>CS: {user_id: same as claimer}
        CS-->>BE: throw ApiError(403)
        BE-->>FE: 403 "Cannot claim own item"
    else Valid Claim
        DB-->>CS: {item details}
        CS->>DB: INSERT INTO claims<br/>(item_id, user_id, message,<br/>status: 'pending')
        DB-->>CS: {id, ...newClaim}
        CS-->>BE: ApiResponse.created()
        BE-->>FE: 201 Created
        FE-->>U: "Claim submitted!"
        Note over O: Owner sees claim<br/>on Dashboard
    end
```

---

## 5. Approve/Reject Claim Flow

```mermaid
sequenceDiagram
    actor O as Item Owner
    participant FE as Frontend<br/>(Dashboard)
    participant BE as Backend API
    participant MW as Auth Middleware
    participant CS as Claim Service
    participant DB as Supabase DB
    actor C as Claimer

    O->>FE: View claims on Dashboard
    FE->>BE: GET /api/claims/item/:itemId
    BE->>MW: Verify JWT
    MW-->>BE: req.user = {id}
    BE->>CS: getClaimsByItem(itemId)
    CS->>DB: SELECT * FROM claims<br/>WHERE item_id = :itemId
    DB-->>CS: [{id, message, status, user_id}]
    CS-->>FE: claims list

    O->>FE: Click "Approve" on a claim
    FE->>BE: PATCH /api/claims/:claimId/status<br/>{status: "approved"}
    BE->>MW: Verify JWT
    MW-->>BE: req.user = {id: ownerId}
    BE->>CS: updateClaimStatus(claimId, status, userId)

    CS->>DB: SELECT claim + item<br/>JOIN items ON claims.item_id
    DB-->>CS: {claim, item}
    CS->>CS: Verify: item.user_id === req.user.id

    alt Not Owner
        CS-->>BE: throw ApiError(403)
        BE-->>FE: 403 Forbidden
    else Authorized Owner
        CS->>DB: UPDATE claims<br/>SET status = 'approved'
        CS->>DB: UPDATE items<br/>SET status = 'claimed'
        DB-->>CS: ✅ Updated
        CS-->>BE: ApiResponse.success()
        BE-->>FE: 200 OK
        FE-->>O: "Claim approved!"
        Note over C: Claimer sees<br/>status: "approved"<br/>on Dashboard
    end
```

---

## 6. Fetch & Filter Items Flow

```mermaid
sequenceDiagram
    actor U as User
    participant FE as Frontend<br/>(Home Page)
    participant AX as Axios Instance
    participant BE as Backend API
    participant IS as Item Service
    participant DB as Supabase DB

    U->>FE: Open Home page
    FE->>FE: useEffect → fetchItems()
    FE->>AX: GET /api/items
    AX->>BE: GET /api/items
    BE->>IS: getAllItems()
    IS->>DB: SELECT * FROM items<br/>ORDER BY created_at DESC
    DB-->>IS: [{item1}, {item2}, ...]
    IS-->>BE: ApiResponse.success(items)
    BE-->>FE: 200 OK {data: items[]}
    FE->>FE: setItems(response.data)
    FE-->>U: Render ItemCard grid

    U->>FE: Click "Lost" filter tab
    FE->>FE: setActiveTab("lost")
    FE->>AX: GET /api/items?status=lost
    AX->>BE: GET /api/items?status=lost
    BE->>IS: getAllItems({status: "lost"})
    IS->>DB: SELECT * FROM items<br/>WHERE status = 'lost'
    DB-->>IS: [filtered items]
    IS-->>BE: ApiResponse.success()
    BE-->>FE: 200 OK
    FE-->>U: Re-render with filtered items
```

---

*Document prepared for: **FoundIt — Lost & Found Portal***
*Version: 1.0 | Date: April 2026*
