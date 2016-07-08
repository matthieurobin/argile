function _mapOrders (data) {
    var sqlRow, order, currentOrderId, currentTillId, currentCashDrawerId;
    var optionsAlreadyComputed     = [];
    var cashDrawersAlreadyComputed = [];
    var res                        = [];

    for (var i = 0; i < data.length; i++) {
      sqlRow = data[i];

      // Order
      if (currentOrderId !== sqlRow.id) {
        currentOrderId = sqlRow.id;

        order                  = _mapRooTProperties(sqlRow);
        order.goodwillGestures = _mapGoodwillGestures(sqlRow);
        order.contract         = _mapContract(sqlRow);
        order.drvBudget        = null;
        order.clientContract   = _mapClientContract(sqlRow);
        order.client           = _mapClient(sqlRow);
        order.recovery         = _mapRecovery(sqlRow);
        order.inventory        = _mapInventory(sqlRow);
        order.cpi              = _mapCPI(sqlRow);
        order.prices           = _mapPrices(sqlRow);

        if (sqlRow.drvBudget_id !== null) {
          order.drvBudget = {id: sqlRow.drvBudget_id, label : sqlRow.label};
        }

        order.tills       = [];
        order.options     = [];
        order.cashDrawers = [];

        currentTillId          = null;
        optionsAlreadyComputed = [];

        res.push(order);
      }

      // Tills
      if (currentTillId !== sqlRow.till_id) {
        currentTillId = sqlRow.till_id;

        order.tills.push({
          id      : sqlRow.till_id,
          nbTills : sqlRow.nbTills
        });
      }

      // Options
      if (optionsAlreadyComputed.indexOf(sqlRow.option_id) === -1 && sqlRow.option_id !== null) {
        optionsAlreadyComputed.push(sqlRow.option_id);
        order.options.push({
          id           : sqlRow.option_id,
          nbOptions    : sqlRow.nbOptions,
          nbOffered    : sqlRow.nbOffered,
          contractType : sqlRow.optionContractType
        });
      }

      // Cash Drawers
      if (cashDrawersAlreadyComputed.indexOf(sqlRow.cashDrawer_id) === -1 && sqlRow.cashDrawer_id !== null) {
        cashDrawersAlreadyComputed.push(sqlRow.cashDrawer_id);
        order.cashDrawers.push({
          id            : sqlRow.cashDrawer_id,
          nbCashDrawers : sqlRow.nbCashDrawers,
        });
      }
    }

    return res;
  }
