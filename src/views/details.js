import { deleteById, getById } from "../api/data.js";
import { like, getOwnLikes, getLikes } from "../api/likes.js";
import { html, nothing } from "../lib.js";

const detailsTemplate = (
  fact,
  likes,
  hasUser,
  canLike,
  isOwner,
  onDelete,
  onLike
) => html` <section id="details">
  <div id="details-wrapper">
    <img id="details-img" src=${fact.imageUrl} alt="example1" />
    <p id="details-category">${fact.category}</p>
    <div id="info-wrapper">
      <div id="details-description">
        <p id="description">${fact.description}</p>
        <p id="more-info">${fact.moreInfo}</p>
      </div>

      <h3>Likes:<span id="likes">${likes}</span></h3>
      ${factControls(fact, hasUser, canLike, isOwner, onDelete, onLike)}
    </div>
  </div>
</section>`;

function factControls(fact, hasUser, canLike, isOwner, onDelete, onLike) {
  if (hasUser == false) {
    return nothing;
  }
  if (canLike) {
    return html` <div id="action-buttons">
      <a @click=${onLike} href="javascript:void(0)" id="like-btn">Like</a>
    </div>`;
  }
  if (isOwner) {
    return html` <div id="action-buttons">
      <a href="/edit/${fact._id}" id="edit-btn">Edit</a>
      <a @click=${onDelete} href="javascript:void(0)" id="delete-btn">Delete</a>
    </div>`;
  }
}

export async function showDetails(ctx) {
  const id = ctx.params.id;
  const requests = [getById(id), getLikes(id)];
  const hasUser = Boolean(ctx.user);
  if (hasUser) {
    requests.push(getOwnLikes(id, ctx.user._id));
  }
  const [fact, likes, hasLikes] = await Promise.all(requests);

  const isOwner = hasUser && ctx.user._id == fact._ownerId;
  const canLike = !isOwner && hasLikes == 0;
  ctx.render(
    detailsTemplate(fact, likes, hasUser, canLike, isOwner, onDelete, onLike)
  );

  async function onDelete() {
    const choice = confirm("Are you sure you want to delete this fact?");

    if (choice) {
      await deleteById(id);
      ctx.page.redirect("/catalog");
    }
  }
  async function onLike() {
    await like(id);
    ctx.page.redirect("/catalog/" + id);
  }
}
