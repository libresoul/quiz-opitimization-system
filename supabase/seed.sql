SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict zcXrqtFfEEKO67RrEsexPEkPPhTWKP9UZ5xq08WkBGZZ1qFM4zDaVUMX507mdai

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: quizzes; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."quizzes" ("id", "created_at", "title", "total_time", "status") VALUES
	(1, '2026-06-16 16:56:59.657738+00', 'General Knowledge Sprint', 18, 'open'),
	(2, '2026-06-16 16:56:59.657738+00', 'Science Drill', 15, 'open'),
	(3, '2026-06-16 16:56:59.657738+00', 'History Recall', 12, 'draft');


--
-- Data for Name: questions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."questions" ("id", "created_at", "quiz_id", "text", "score", "time") VALUES
	(1, '2026-06-16 16:57:46.593432+00', 1, 'What is the capital of France?', 5, 2),
	(2, '2026-06-16 16:57:46.593432+00', 1, 'Which planet is known as the Red Planet?', 7, 3),
	(3, '2026-06-16 16:57:46.593432+00', 1, 'Who wrote Romeo and Juliet?', 6, 2),
	(4, '2026-06-16 16:57:46.593432+00', 2, 'What is the chemical symbol for water?', 4, 1),
	(5, '2026-06-16 16:57:46.593432+00', 2, 'Which gas do plants absorb from the atmosphere?', 5, 2),
	(6, '2026-06-16 16:57:46.593432+00', 2, 'What force keeps us on the ground?', 6, 2),
	(7, '2026-06-16 16:57:46.593432+00', 3, 'In what year did World War II end?', 6, 3),
	(8, '2026-06-16 16:57:46.593432+00', 3, 'Who was the first president of the United States?', 5, 2),
	(9, '2026-06-16 16:57:46.593432+00', 3, 'What is the chemical symbol for gold?', 3, 1);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."users" ("id", "name", "email", "role", "created_at") VALUES
	('1de0e101-90d2-403f-bcec-5a954e63ba44', 'Damindu Dhananjitha', 'damindu@gmail.com', 'user', '2026-06-16 15:07:21.969769+00'),
	('73e09dfe-ae8c-4e42-958a-13cef44a8b96', 'Dhannjitha Gamage', 'damindu@gmail.me', 'user', '2026-06-16 16:33:49.806255+00');


--
-- Data for Name: answers; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Name: answers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."answers_id_seq"', 1, false);


--
-- Name: questions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."questions_id_seq"', 9, true);


--
-- Name: quizzes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."quizzes_id_seq"', 3, true);


--
-- PostgreSQL database dump complete
--

-- \unrestrict zcXrqtFfEEKO67RrEsexPEkPPhTWKP9UZ5xq08WkBGZZ1qFM4zDaVUMX507mdai

RESET ALL;
