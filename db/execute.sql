--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1
-- Dumped by pg_dump version 15.1

-- Started on 2022-11-28 12:13:40

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 16686)
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- TOC entry 3357 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- TOC entry 842 (class 1247 OID 16688)
-- Name: auths_provider_enum; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.auths_provider_enum AS ENUM (
    'APP',
    'GOOGLE'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 214 (class 1259 OID 16693)
-- Name: auths; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.auths (
    id integer NOT NULL,
    username character varying NOT NULL,
    password character varying,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    provider public.auths_provider_enum DEFAULT 'APP'::public.auths_provider_enum NOT NULL
);


--
-- TOC entry 215 (class 1259 OID 16701)
-- Name: auths_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.auths_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3359 (class 0 OID 0)
-- Dependencies: 215
-- Name: auths_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.auths_id_seq OWNED BY public.auths.id;


--
-- TOC entry 216 (class 1259 OID 16702)
-- Name: notes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notes (
    id integer NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    content character varying NOT NULL,
    "userId" integer,
    "deletedAt" timestamp without time zone
);


--
-- TOC entry 217 (class 1259 OID 16709)
-- Name: notes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.notes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3360 (class 0 OID 0)
-- Dependencies: 217
-- Name: notes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.notes_id_seq OWNED BY public.notes.id;


--
-- TOC entry 218 (class 1259 OID 16710)
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    "authId" integer NOT NULL,
    name character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 219 (class 1259 OID 16717)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3361 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 3186 (class 2604 OID 16741)
-- Name: auths id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auths ALTER COLUMN id SET DEFAULT nextval('public.auths_id_seq'::regclass);


--
-- TOC entry 3190 (class 2604 OID 16742)
-- Name: notes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notes ALTER COLUMN id SET DEFAULT nextval('public.notes_id_seq'::regclass);


--
-- TOC entry 3193 (class 2604 OID 16743)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 3346 (class 0 OID 16693)
-- Dependencies: 214
-- Data for Name: auths; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.auths VALUES (1, 'iamroot', '$2b$10$Ims5uKg0xFbXlUMHNt1/4eKgLhdLSy1m9tJ1lLXyqkSfG4dFp9aLS', '2022-11-16 07:46:10.311976', '2022-11-16 07:46:10.311976', 'APP');
INSERT INTO public.auths VALUES (7, 'vhquan9998@gmail.com', NULL, '2022-11-21 08:40:04.730363', '2022-11-21 08:40:04.730363', 'GOOGLE');
INSERT INTO public.auths VALUES (8, 'quanjoker09@gmail.com', NULL, '2022-11-21 08:59:16.746567', '2022-11-21 08:59:16.746567', 'GOOGLE');
INSERT INTO public.auths VALUES (9, 'jcantoniocoorp@gmail.com', NULL, '2022-11-24 08:08:35.900672', '2022-11-24 08:08:35.900672', 'GOOGLE');


--
-- TOC entry 3348 (class 0 OID 16702)
-- Dependencies: 216
-- Data for Name: notes; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- TOC entry 3350 (class 0 OID 16710)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.users VALUES (2, 7, 'Jun', '2022-11-21 08:40:05.203542', '2022-11-21 08:40:05.203542');
INSERT INTO public.users VALUES (3, 8, 'Quân Vũ Hoàng', '2022-11-21 08:59:17.216741', '2022-11-21 08:59:17.216741');
INSERT INTO public.users VALUES (4, 9, 'Jean-Claude Antonio', '2022-11-24 08:08:35.913135', '2022-11-24 08:08:35.913135');
INSERT INTO public.users VALUES (1, 1, 'I Am Root', '2022-11-16 07:46:31.00191', '2022-11-16 07:46:31.00191');


--
-- TOC entry 3362 (class 0 OID 0)
-- Dependencies: 215
-- Name: auths_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.auths_id_seq', 9, true);


--
-- TOC entry 3363 (class 0 OID 0)
-- Dependencies: 217
-- Name: notes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.notes_id_seq', 1, false);


--
-- TOC entry 3364 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 4, true);


--
-- TOC entry 3197 (class 2606 OID 16726)
-- Name: auths PK_22fc0631a651972ddc9c5a31090; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.auths
    ADD CONSTRAINT "PK_22fc0631a651972ddc9c5a31090" PRIMARY KEY (id);


--
-- TOC entry 3201 (class 2606 OID 16728)
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- TOC entry 3199 (class 2606 OID 16730)
-- Name: notes PK_af6206538ea96c4e77e9f400c3d; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT "PK_af6206538ea96c4e77e9f400c3d" PRIMARY KEY (id);


--
-- TOC entry 3202 (class 2606 OID 16731)
-- Name: notes FK_829532ff766505ad7c71592c6a5; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT "FK_829532ff766505ad7c71592c6a5" FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- TOC entry 3203 (class 2606 OID 16736)
-- Name: users FK_f8ecddfc60e9d1c2719ab17fe6a; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "FK_f8ecddfc60e9d1c2719ab17fe6a" FOREIGN KEY ("authId") REFERENCES public.auths(id);


--
-- TOC entry 3358 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: -
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2022-11-28 12:13:41

--
-- PostgreSQL database dump complete
--

