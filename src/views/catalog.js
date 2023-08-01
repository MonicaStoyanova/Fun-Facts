import { getAll } from "../api/data.js";
import { html } from "../lib.js";

const catalogTemplate = (facts) => html`
  <section id="dashboard">
    <h2>Fun Facts</h2>
    ${facts.length == 0
      ? html` <
          <h2>No Fun Facts yet.</h2>
          >`
      : facts.map(factCardTemplate)}
  </section>
`;
const factCardTemplate = (fact) => html`
  <div class="fact">
    <img src=${fact.imageUrl} alt="example1" />
    <h3 class="category">${fact.category}</h3>
    <p class="description">${fact.description}</p>
    <a class="details-btn" href="/catalog/${fact._id}">More Info</a>
  </div>
`;

export async function showCatalog(ctx) {
  const facts = await getAll();
  ctx.render(catalogTemplate(facts));
}
