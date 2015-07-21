<button type="button" class="btn btn-default app-gesture-button">
    <%= name %>
    <span class="app-duration label label-warning"><%= speed.default %><%= speed.unit %></span>
    <span class="app-intensity label label-danger"><%= magnitude.default * 100 %><%= magnitude.unit %></span>
</button>
