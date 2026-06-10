create or replace function get_trending_videos(
    max_limit integer default 20,
    gravity numeric default 1.5,
    exclude_url_id character varying(11) default null
  ) returns table (
    title text,
    description text,
    url_id character varying(11),
    view_count integer
  ) language sql as $$
select title,
  description,
  url_id,
  view_count
from public.videos
where deleted_at is null -- If an ID is provided, filter it out. If it is null, ignore this check.
  and (
    exclude_url_id is null
    or url_id != exclude_url_id
  )
order by (
    (view_count + 1) / power(
      extract(
        epoch
        from (now() - created_at)
      ) / 3600 + 2,
      gravity
    )
  ) * (0.5 + random()) desc
limit max_limit;
$$;
