Vue.use(VueSocketio, 'http://' + document.domain + ':' + location.port);
Vue.use(window.VueCodemirror)

clog = console.log;
var sample_data = () => {
  return [
    {
      title: "<a href='http://www.amazon.com/Professional-JavaScript-Developers-Nicholas-Zakas/dp/1118026691'>Professional JavaScript for Web Developers</a>",
      description: "This .",
      comments: `<a class="button action-btn is-small" onclick="vm.toggle('show_modal_read_only')">Show RO Modal</a>`,
    },
    {
      title: "<a href='http://shop.oreilly.com/product/9780596517748.do'>JavaScript: The Good Parts</a>",
      description: "This book provides a developer-level introduction along with <b>more advanced</b> and useful features of JavaScript.",
      comments: "This is the book about JavaScript",
    },
    {
      title: "<a href='http://shop.oreilly.com/product/9780596805531.do'>JavaScript: The Definitive Guide</a>",
      description: "<em>JavaScript: The Definitive Guide</em> provides a thorough description of the core <b>JavaScript</b> language and both the legacy and standard DOMs implemented in web browsers.",
      comments: "I've never actually read it, but the <a href='http://shop.oreilly.com/product/9780596805531.do'>comments</a> are highly <strong>positive</strong>.",
    }
  ]
};
var sample_data2 = () => {
  return [
    {
      task_type: "DB-to-DB",
      source_system: "DB111",
      source_object: "SCHEM.TABLE434",
      target_system: "HIVE",
      target_object: "ssschm.tab55",
      a: `<a title="Run Task" class="button action-btn is-small" onclick="vm.show_modal_run_task(15464645)"><i class="icon-play"></i></a>`
         + `<a title="Details" class="button action-btn is-small" onclick="vm.toggle('show_modal_read_only')"><i class="icon-info"></i></a>`
         + `<a title="History" class="button action-btn is-small" onclick="vm.toggle('show_modal_read_only')"><i class="icon-h-sign"></i></a>`,
    },
    {
      task_type: "DB-to-DB",
      source_system: "LOCAL_FILE",
      source_object: "/path/tab55",
      target_system: "HIVE",
      target_object: "ssschm.tab55",
      a: `<a title="Run Task" class="button action-btn is-small" onclick="vm.show_modal_run_task(634634645)"><i class="icon-play"></i></a>`
      + `<a title="Details" class="button action-btn is-small" onclick="vm.toggle('show_modal_read_only')"><i class="icon-info"></i></a>`
      + `<a title="History" class="button action-btn is-small" onclick="vm.toggle('show_modal_read_only')"><i class="icon-h-sign"></i></a>`,
    },
    {
      task_type: "DB-to-DB",
      source_system: "DB111",
      source_object: "SCHEM.TABLE434",
      target_system: "HIVE",
      target_object: "ssschm.tab55",
      a: `<a title="Run Task" class="button action-btn is-small" onclick="vm.show_modal_run_task(15464645)"><i class="icon-play"></i></a>`
      + `<a title="Details" class="button action-btn is-small" onclick="vm.toggle('show_modal_read_only')"><i class="icon-info"></i></a>`
      + `<a title="History" class="button action-btn is-small" onclick="vm.toggle('show_modal_read_only')"><i class="icon-h-sign"></i></a>`,
    },
  ]
};
var sample_data_history = () => {
  return [
    {
      task_id: 15464645,
      task_type: "DB-to-DB",
      source_system: "DB111",
      source_object: "SCHEM.TABLE434",
      target_system: "HIVE",
      target_object: "ssschm.tab55",
      status: 'Running',
      duration: 67,
      start_time: 1513367791,
      end_time: null
    },
    {
      task_id: 15464645,
      task_type: "DB-to-DB",
      source_system: "DB111",
      source_object: "SCHEM.TABLE434",
      target_system: "HIVE",
      target_object: "ssschm.tab55",
      status: 'Completed',
      duration: 67,
      start_time: 1513367791,
      end_time: 1513367791+1000
    },
  ]
};

window.vm = new Vue({
  el: '#app',
  
  ////////////////////////////////////////////////////////////
  components:{
    codemirror: VueCodemirror.codemirror
  },
  
  ////////////////////////////////////////////////////////////
  data: {
    name:'John',
    toggles:{
      show_modal_read_only:false,
      show_modal_modify:false,
      show_modal_editor:false,
      show_notification:false,
      filter_tasks_loading:false,
    },
    modals:{},
    inputs: {
      search_tasks:'',
      search_history:'',
      config_path: '/path/to/yaml',
    },
    settings:{
      modal_read_only: {
        title: null,
      },
      modal_modify: {
        title: null,
        inputs: {},
        buttons: {},
      },
      modal_editor: {
        title: null,
        text:`hello!`,
        height: '400px',
        options: {
          // codemirror options
          tabSize: 2,
          lineWrapping: true,
          smartIndent: true,
          matchBrackets : true,
          autofocus: true,
          autoRefresh: true,
          readOnly: true,
          theme: "rubyblue",
          // theme: 'base16-dark',
          lineNumbers: true,
          line: true,
          // keyMap: "sublime",
          extraKeys: {
            "Ctrl": "autocomplete",
            // "Ctrl-Enter": function(cm, v1, v2) {console.log(v2)},
            "Tab": function (cm) {
              if (cm.somethingSelected()) {
                var sel = editor.getSelection("\n");
                // Indent only if there are multiple lines selected, or if the selection spans a full line
                if (sel.length > 0 && (sel.indexOf("\n") > -1 || sel.length === cm.getLine(cm.getCursor().line).length)) {
                  cm.indentSelection("add");
                  return;
                }
              }
              if (cm.options.indentWithTabs)
                cm.execCommand("insertTab");
              else
                cm.execCommand("insertSoftTab");
            },
            "Shift-Tab": function (cm) {
              cm.indentSelection("subtract");
            }
          },
          foldGutter: true,
          gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
          styleSelectedText: true,
          highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true },
        },
        inputs: {},
        buttons: {},
      },
      recent_files: [
        '/code/faaaaa.yml'
      ],
      search: {
        tasks:'',
      },
      table_task_sort_order: [
        {
          field: 'name',
          direction: 'asc'
        }
      ],
      notif_text: `Lorem ipsum dolor sit amet, consectetur
      adipiscing elit lorem ipsum dolor. <strong>Pellentesque risus mi</strong>, tempus quis placerat ut, porta nec nulla. Vestibulum rhoncus ac ex sit amet fringilla. Nullam gravida purus diam, et dictum <a>felis venenatis</a> efficitur. Sit amet,
      consectetur adipiscing elit`,
    },
    hot: {},
    tasks: {
      15464645: {
        task_type: "DB-to-DB",
        source_system: "DB111",
        source_object: "SCHEM.TABLE434",
        target_system: "HIVE",
        target_object: "ssschm.tab55",
        a: `<a title="Run Task" class="button action-btn is-small" onclick="vm.show_modal_run_task(15464645)"><i class="icon-play"></i></a>`
           + `<a title="Details" class="button action-btn is-small" onclick="vm.toggle('show_modal_read_only')"><i class="icon-info"></i></a>`
           + `<a title="History" class="button action-btn is-small" onclick="vm.toggle('show_modal_read_only')"><i class="icon-h-sign"></i></a>`,
      }
    },
    history: {
      fields: [
        'task_id',
        'task_type',
        'source_system',
        'source_object',
        'target_system',
        // 'target_object',
        'status',
        'duration',
        // 'start_time',
      ],
      rows: sample_data_history(),
    },
    databases: {}
  },

  ////////////////////////////////////////////////////////////
  sockets:{
    connect: () => {
      clog('socket connected')
    },
    receive_task_update: () => {},
  },
  
  ////////////////////////////////////////////////////////////
  ready() {
  },
  
  ////////////////////////////////////////////////////////////
  store: store,
  
  ////////////////////////////////////////////////////////////
  computed: {
    is_toggled(key){
      return this.toggles[key]
    },
    main_editor() {
      return this.$refs.main_editor.editor
    },
    main_editor_cursor() {
      return this.$refs.main_editor.editor.getDoc().getCursor();
    },
  },
  
  ////////////////////////////////////////////////////////////
  methods: {
    is_running(row){
      return row.status == 'Running'
    },
    form_name(str){
      return str.replace(' ', '_').toLowerCase();
    },
    form_label(str){
      return StringTitle(str.replace('_', ' '));
    },
    toggle(key){
      this.toggles[key] = !this.toggles[key];
      clog(`Toggle ${key} is ${this.toggles[key]}`)
    },
    toggle_modal(modal_type, modal_name){
      let self=this
      this.settings[modal_type] = this.modals[modal_name]
      this.toggle('show_'+modal_type)
    },
    load_config(file_path){
      clog(`Loading ${file_path}`)
    },
    save_config(file_path){
      clog(`Saving ${file_path}`)
    },
    get_form_values(form_name){
      return readForm('modal_modify_form')
    },
    filter_history(search_text){},
    run_task(task_type, params){},
    cancel_task(task_id){},

    update_running_time(){
      let self = this;
      this.$forceUpdate();
      let data = sample_data_history().map(
        (row) => {
          row['duration'] = self.get_duration(row)
          return row
        }
      )
      // this.create_table_history()
      // this.hot['history'].setDataAtCell(row, col, value)
      // this.hot['history'].setDataAtRowProp(row, prop, value, source)

      
      // for (let i = 0; i < data.length; i++) {
      //   const row = data[i];
      //   this.hot['history'].setDataAtRowProp(i, 'duration', self.get_duration(row))
      // }
    },
    get_duration(row){
      function pad(n, width=3, z=0) {return (String(z).repeat(width) + String(n)).slice(String(n).length)}
      let lapsed = row.end_time? (new Date(row.end_time*1000)) - (new Date(row.start_time*1000)) : Date.now() - (new Date(row.start_time*1000))
      let secs = Math.floor(lapsed / 1000)
      let mins = Math.floor(secs / 60)
      let datestring = `${pad(mins, width=3)}:${pad(secs-mins*60, width=2)}`
      return datestring
    },

    show_modal_queue_task(task_id){
      let self=this
      let task = this.tasks[task_id]
      self.settings['modal_read_only'] = this.modals['queue_task_details']
      self.settings['modal_read_only'].title = `Task ${task_id}`
      Object.keys(task).forEach(function(key) {
        if(key != 'a') self.settings['modal_read_only'].inputs[self.form_label(key)] = task[key]
      }, this);

      this.toggle('show_modal_read_only')
    },
    show_modal_run_task(task_id){
      let self=this
      let task = this.tasks[task_id]
      self.settings['modal_modify'] = this.modals['run_task_details']

      // Submit Function
      self.settings['modal_modify'].buttons['Submit'].func = ()=>{
        // input validation
        clog('Running task ' + task_id);
        self.toggle('show_modal_modify')
      }

      // Add inputs & Values
      self.settings['modal_modify'].title = `Run Task ${task_id}`
      Object.keys(task).forEach(function(key) {
        if(key != 'a') self.settings['modal_modify'].inputs[self.form_label(key)] = task[key]
      }, this);

      this.toggle('show_modal_modify')
    },
    show_modal_task_log(task_id){
      let self=this
      let task = this.tasks[task_id]
      self.settings['modal_editor'] = this.modals['view_task_log']
      self.settings['modal_editor'].title = `Log of Task ${task_id}`
      self.settings['modal_editor'].text = `This is the log of Task ${task_id}`

      this.toggle('show_modal_editor')
    },

    set_modals(){
      let self=this
      return {
        view_task_details:{
          title: 'Modal Title!',
          inputs: {
            'First Name': 'Fritz',
            'Last Name': 'Larco',
            'Address': 'FL',
          },
          buttons: {
            'Submit': {
              class:'is-success',
              func: ()=>{},
            },
            'Cancel': {
              class:'',
              func: ()=>{ self.toggle('show_modal_modify') },
            },
          },
        },
        run_task_details:{
          title: 'Run Task',
          template: 'modal_modify',
          inputs: {},
          buttons: {
            'Submit': {
              class:'is-success',
              func: ()=>{},
            },
            'Cancel': {
              class:'',
              func: ()=>{ self.toggle('show_modal_modify') },
            },
          },
        },
        queue_task_details:{
          template: 'modal_read_only',
          title: 'Task',
          inputs: {},
          buttons: {
            'Close': {
              class:'',
              func: ()=>{ self.toggle('show_modal_read_only') },
            },
          },
        },
        view_task_log:{
          template: 'modal_read_only',
          title: 'Task',
          inputs: {},
          buttons: {
            'Close': {
              class:'',
              func: ()=>{ self.toggle('show_modal_read_only') },
            },
          },
        },
      }
    },
    
    clear_input(evnt){
      evnt.path[0].value=''
    },

    create_table_tasks(){
     
      this.hot['tasks'] = new Handsontable(document.getElementById('table_tasks'), {
        colHeaders: ["Task Type", "S. System", "S. Object", "T. System", "T. Object", "A"],
        columns: [
          {data: "task_type", readOnly: true},
          {data: "source_system", readOnly: true},
          {data: "source_object", readOnly: true},
          {data: "target_system", readOnly: true},
          {data: "target_object", readOnly: true},
          {data: "a", renderer: "html", readOnly: false, width: 70},
          // {data: "comments", renderer: hotHelpers.safeHtmlRenderer, readOnly: true},
        ],
        data: sample_data2(),
        
        minSpareCols: 1,
        minSpareRows: 1,
        stretchH: 'all',
        rowHeaders: true,
        contextMenu: false,
        wordWrap: true,
        search: true,
        columnSorting: true,
        sortIndicator: true,
        manualColumnResize: true,
        modifyColWidth: function(width, col){
          if(width > 250){
            return 250
          }
        }
      });
    },

    create_table_history(){
      let self = this;

      let colHeaders = self.history.fields.map((field) => { return self.form_label(field) })
      let columns = self.history.fields.map((field) => { return {data: field, readOnly: true} })
      let data = sample_data_history().map(
        (row) => {
          row['duration'] = self.get_duration(row)
          return row
        }
      )

      this.hot['history'] = new Handsontable(document.getElementById('table_history'), {
        colHeaders: colHeaders,
        columns: columns,
        data: data,

        minSpareCols: 1,
        minSpareRows: 1,
        stretchH: 'all',
        rowHeaders: true,
        contextMenu: false,
        wordWrap: true,
        search: true,
        columnSorting: true,
        sortIndicator: true,
        manualColumnResize: true,
        modifyColWidth: function(width, col){
          if(width > 250){
            return 250
          }
        }
      });

    },

    reload_table_tasks(){
      Math.floor(Math.random() * 20)
    },

    onEditorReady() {
      clog('the editor is ready!')
      // this.main_editor_text = localStorage.getItem('sql_text');
    },
    onLogEditorReady(){
      // let self=this;
      // var scrollInfo = self.log_editor.getScrollInfo();
      // self.log_editor.scrollTo(0, scrollInfo.height - scrollInfo.clientHeight);
    },
    onEditorFocus() {
      // localStorage.setItem('sql_text', this.main_editor_text);
    },
    onEditorCodeChange() {
      // localStorage.setItem('sql_text', this.main_editor_text);
    },

  },
  
  ////////////////////////////////////////////////////////////
  mounted() {
    let self=this

    // Set modals
    this.modals = self.set_modals()

    // Create Tables
    this.create_table_tasks()
    this.create_table_history()

    // Get databases
    this.databases = {
      'DB111':'oracle',
      'DB444':'oracle',
      'HIVE':'hive',
    }

    // Interval
    self.running_interval = setInterval(self.update_running_time, 1000)
  },
});
