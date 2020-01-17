const onOpen = () => {
  SpreadsheetApp.getUi()
    .createMenu('Split Cells')
    .addItem('Run on Selected Cells', 'runSplitter')
    .addToUi();
};

export default onOpen;
