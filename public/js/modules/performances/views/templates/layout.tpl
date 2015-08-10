<div class="container">
    <div class="row">
        <div class="col-md-9">
            <h4>Engagement loop mode</h4>

            <div class="btn-group" role="group" aria-label="Engagement loop mode">
                <button type="button" class="btn btn-primary">On</button>
                <button type="button" class="btn btn-default">Off</button>
                <button type="button" class="btn btn-default">Tradeshow</button>
                <button type="button" class="btn btn-default">Stage</button>
                <button type="button" class="btn btn-default">Companion</button>
            </div>
        </div>
        <div class="col-md-3">
            <h4>Transitions</h4>

            <div class="btn-group" role="group" aria-label="Sleep, wake up">
                <button type="button" class="btn btn-default">Sleep</button>
                <button type="button" class="btn btn-default">Wake</button>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <h4>Performances</h4>

            <form class="form-inline" style="margin-bottom: 10px">
                <div class="form-group">
                    <label class="sr-only" for="exampleInputAmount">Repeat every</label>

                    <div class="input-group">
                        <div class="input-group-addon">Repeat every</div>
                        <input type="text" value="3" class="form-control" id="exampleInputAmount" placeholder="">

                        <div class="input-group-addon">second(s)</div>
                    </div>
                </div>
            </form>

            <div class="btn-group" role="group" aria-label="Performances">
                <button type="button" class="btn btn-default">Introduce</button>
                <button type="button" class="btn btn-default">Tell a joke</button>
                <button type="button" class="btn btn-default">Do something</button>
                <button type="button" class="btn btn-default">Do something else</button>
            </div>

            <div class="clearfix">
                <h4 class="pull-left">Event queue</h4>
                <button id="app-clear-performance-queue" class="pull-right btn btn-default">
                    <span class="glyphicon glyphicon-trash"></span>
                    Clear all
                </button>
            </div>

            <ul id="app-performance-queue" class="list-group">
                <li class="list-group-item">
                    <span class="pull-left ui-icon ui-icon-arrowthick-2-n-s"></span>
                    Introduce
                    <div class="pull-right">
                        <span class="label label-primary">duration: 1 sec</span>

                        <button type="button" class="pull-right btn btn-danger">
                            <span class="glyphicon glyphicon-trash"></span>
                        </button>
                    </div>
                </li>
                <li class="list-group-item">
                    <span class="pull-left ui-icon ui-icon-arrowthick-2-n-s"></span>
                    Tell a joke
                    <div class="pull-right">
                        <span class="label label-primary">duration: 3 sec</span>

                        <button type="button" class="pull-right btn btn-danger">
                            <span class="glyphicon glyphicon-trash"></span>
                        </button>
                    </div>
                </li>
                <li class="list-group-item">
                    <span class="pull-left ui-icon ui-icon-arrowthick-2-n-s"></span>
                    Do something else
                    <div class="pull-right">
                        <span class="label label-primary">duration: 2 sec</span>

                        <button type="button" class="pull-right btn btn-danger">
                            <span class="glyphicon glyphicon-trash"></span>
                        </button>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</div>
